import {
  Component,
  computed,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Navbar } from '../shared/navbar/navbar';
import { AuthService } from '../core/services/auth';

@Component({
  selector: 'app-typing-test',
  standalone: true,
  imports: [Navbar],
  templateUrl: './typing-test.html',
  styleUrl: './typing-test.css'
})
export class TypingTest implements OnDestroy, AfterViewInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.generateWords();
    this.handleGoogleLogin();
  }

  private wordBank = [
    'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog',
    'and', 'this', 'is', 'a', 'typing', 'test', 'computer', 'keyboard',
    'speed', 'practice', 'learn', 'write', 'fast', 'simple', 'code',
    'website', 'development', 'angular', 'java', 'spring', 'boot',
    'database', 'project', 'student', 'future', 'technology', 'software',
    'developer', 'application', 'system', 'internet', 'world', 'good',
    'time', 'work', 'make', 'create', 'build', 'start', 'learn',
    'every', 'day', 'people', 'place', 'life', 'important', 'small',
    'large', 'great', 'new', 'first', 'last', 'next', 'better',
    'while', 'using', 'with', 'from', 'into', 'about', 'after',
    'before', 'again', 'right', 'different', 'another', 'example'
  ];

  words = signal<string[]>([]);

  currentWordIndex = signal(0);

  currentWord = computed(() => this.words()[this.currentWordIndex()] ?? '');

  displayStart = computed(() => {
    const index = this.currentWordIndex();

    if (index < 20) {
      return 0;
    }

    return Math.floor(index / 10) * 10;
  });

  typedText = signal('');

  timeLeft = signal(30);

  selectedTime = signal(30);

  completedCorrectCharacters = signal(0);
  completedIncorrectCharacters = signal(0);
  wordResults = signal<('correct' | 'incorrect')[]>([]);
  wordTypedTexts = signal<string[]>([]);

  currentCorrect = computed(() => {
    const typed = this.typedText();
    const word = this.currentWord() ?? '';
    let count = 0;

    for (let i = 0; i < typed.length; i++) {
      if (i < word.length && typed[i] === word[i]) {
        count++;
      }
    }

    return count;
  });

  currentIncorrect = computed(() => {
    const typed = this.typedText();
    const word = this.currentWord() ?? '';
    let count = 0;

    for (let i = 0; i < typed.length; i++) {
      if (i >= word.length || typed[i] !== word[i]) {
        count++;
      }
    }

    return count;
  });

  correctCharacters = computed(
    () => this.completedCorrectCharacters() + this.currentCorrect()
  );

  incorrectCharacters = computed(
    () => this.completedIncorrectCharacters() + this.currentIncorrect()
  );

  wpm = signal(0);

  accuracy = signal(100);

  timerStarted = false;

  private startedAt = 0;

  private finished = false;

  @ViewChild('typingInput') typingInput!: ElementRef<HTMLInputElement>;

  timer: ReturnType<typeof setInterval> | null = null;

  handleGoogleLogin(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.authService.saveToken(token);

      window.history.replaceState(
        {},
        document.title,
        '/'
      );
    }
  }

  generateWords(): void {
    const generatedWords: string[] = [];

    let previousWord = '';

    for (let i = 0; i < 300; i++) {
      let randomWord = '';

      do {
        const randomIndex = Math.floor(
          Math.random() * this.wordBank.length
        );

        randomWord = this.wordBank[randomIndex];
      } while (randomWord === previousWord);

      generatedWords.push(randomWord);
      previousWord = randomWord;
    }

    this.words.set(generatedWords);
  }


  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const text = input.value;

    if (this.finished) {
      return;
    }

    // If input becomes empty normally, keep the current word active.
    if (text === '') {
      this.typedText.set('');
      this.calculateStats();
      return;
    }

    // Start timer when typing begins
    if (!this.timerStarted) {
      this.startTimer();
    }

    // Space finishes the current word
    if (text.endsWith(' ')) {
      if (text.trim() === '') {
        input.value = '';
        return;
      }

      const typedWord = text.trim();
      const currentWord = this.currentWord();
      const currentIndex = this.currentWordIndex();

      // Save what the user typed for this word
      this.wordTypedTexts.update(words => {
        const updated = [...words];
        updated[currentIndex] = typedWord;
        return updated;
      });

      // Remove old result if this word was previously completed
      // Remove old result if this word was previously completed
      const previousResult = this.wordResults()[currentIndex];

      if (previousResult) {

        if (previousResult === 'correct') {
          this.completedCorrectCharacters.update(
            value => value - currentWord.length
          );
        } else {
          this.completedIncorrectCharacters.update(
            value => value - (this.wordTypedTexts()[currentIndex]?.length ?? 0)
          );
        }
      }

      // Correct word
      if (typedWord === currentWord) {

        this.completedCorrectCharacters.update(
          value => value + currentWord.length
        );

        this.wordResults.update(results => {
          const updated = [...results];
          updated[currentIndex] = 'correct';
          return updated;
        });

      } else {

        // Incorrect word
        this.completedIncorrectCharacters.update(
          value => value + typedWord.length
        );

        this.wordResults.update(results => {
          const updated = [...results];
          updated[currentIndex] = 'incorrect';
          return updated;
        });
      }

      // Move to next word
      this.typedText.set('');

      input.value = '';

      this.calculateStats();

      this.nextWord();

      return;
    }

    // Normal typing
    this.typedText.set(text);

    this.calculateStats();
  }

  onKeyDown(event: KeyboardEvent): void {

    if (event.key === 'Tab') {
      event.preventDefault();
      this.restartTest();
      return;
    }

    if (
      event.key === 'Backspace' &&
      this.typedText().length === 0 &&
      this.currentWordIndex() > 0
    ) {

      const previousIndex = this.currentWordIndex() - 1;

      // If previous word was correct, don't go back
      if (this.wordResults()[previousIndex] === 'correct') {
        return;
      }

      event.preventDefault();

      const previousTypedText =
        this.wordTypedTexts()[previousIndex] ?? '';

      const previousWord =
        this.words()[previousIndex];

      // Remove previous incorrect word's score
      this.completedIncorrectCharacters.update(
        value => Math.max(0, value - previousTypedText.length)
      );

      // Move back
      this.currentWordIndex.set(previousIndex);

      // Restore typed text
      this.typedText.set(previousTypedText);

      // Remove result
      this.wordResults.update(results => {
        const updated = [...results];
        updated[previousIndex] = undefined as never;
        return updated;
      });

      // Restore input
      if (this.typingInput) {
        this.typingInput.nativeElement.value = previousTypedText;
        this.typingInput.nativeElement.focus();
      }

      this.calculateStats();
    }
  }


  getCharacterClass(wordIndex: number, charIndex: number): string {

    // Previous words
    if (wordIndex < this.currentWordIndex()) {

      const word = this.words()[wordIndex];
      const typed = this.wordTypedTexts()[wordIndex] ?? '';

      // Character was typed
      if (charIndex < typed.length) {

        return typed[charIndex] === word[charIndex]
          ? 'char-correct'
          : 'char-incorrect';
      }

      // Character was not typed
      return 'char-incorrect';
    }

    // Future words
    if (wordIndex > this.currentWordIndex()) {
      return 'char-pending';
    }

    // Current word
    const word = this.currentWord();
    const typed = this.typedText();

    // Typed characters
    if (charIndex < typed.length) {

      return typed[charIndex] === word[charIndex]
        ? 'char-correct'
        : 'char-incorrect';
    }

    // Cursor position
    if (charIndex === typed.length) {
      return 'char-current';
    }

    // Characters after cursor
    return 'char-pending';
  }


  nextWord(): void {
    if (this.currentWordIndex() < this.words().length - 1) {

      this.currentWordIndex.update(index => index + 1);
      this.typedText.set('');
      if (this.typingInput) {
        this.typingInput.nativeElement.value = '';
      }

    } else {
      this.finishTest();
    }
  }


  restartTest(): void {

    this.finished = false;

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.currentWordIndex.set(0);

    this.generateWords();

    this.typedText.set('');

    this.completedCorrectCharacters.set(0);
    this.completedIncorrectCharacters.set(0);
    this.wordResults.set([]);
    this.wordTypedTexts.set([]);

    this.wpm.set(0);

    this.accuracy.set(100);

    this.timeLeft.set(this.selectedTime());

    this.timerStarted = false;

    if (this.typingInput) {
      this.typingInput.nativeElement.value = '';
    }

    setTimeout(() => this.focusInput());

  }


  focusInput(): void {
    this.typingInput?.nativeElement.focus();
  }


  ngAfterViewInit(): void {
    // Focus the hidden input once the view is ready so the user can
    // start typing immediately after route navigation.
    setTimeout(() => this.focusInput());
  }


  selectTime(seconds: number): void {

    this.selectedTime.set(seconds);

    this.restartTest();

  }


  startTimer(): void {

    this.timerStarted = true;

    this.startedAt = Date.now();

    this.timer = setInterval(() => {

      this.timeLeft.update(time => time - 1);

      this.calculateStats();

      if (this.timeLeft() <= 0) {
        this.finishTest();
      }

    }, 1000);

  }


  calculateStats(): void {
    const correct = this.correctCharacters();
    const incorrect = this.incorrectCharacters();
    const totalTyped = correct + incorrect;

    const elapsedTime =
      this.timerStarted || this.finished
        ? (Date.now() - this.startedAt) / 1000
        : 0;

    if (elapsedTime > 0) {
      const minutes = elapsedTime / 60;
      const calculatedWpm = (this.completedCorrectCharacters() / 5) / minutes;
      this.wpm.set(Math.max(0, Math.round(calculatedWpm)));
    } else {
      this.wpm.set(0);
    }

    if (totalTyped > 0) {
      const calculatedAccuracy = (correct / totalTyped) * 100;
      this.accuracy.set(Math.max(0, Math.min(100, Math.round(calculatedAccuracy))));
    } else {
      this.accuracy.set(0);
    }
  }


  finishTest(): void {

    if (this.finished) return;
    this.finished = true;

    // Stop timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Make sure timer shows exactly 0
    this.timeLeft.set(0);

    // A word without SPACE is not completed and cannot earn WPM credit.
    const pendingCharacters = this.typedText().length;

    if (pendingCharacters > 0) {
      this.completedIncorrectCharacters.update(
        value => value + pendingCharacters
      );
      this.typedText.set('');
      if (this.typingInput) {
        this.typingInput.nativeElement.value = '';
      }
    }

    // Calculate final statistics
    this.calculateStats();

    // Mark test as finished
    this.timerStarted = false;
    this.startedAt = 0;

    // Go to results page
    this.router.navigate(['/results'], {
      queryParams: {
        wpm: this.wpm(),
        accuracy: this.accuracy(),
        correct: this.correctCharacters(),
        incorrect: this.incorrectCharacters(),
        duration: this.selectedTime()
      }
    });
  }


  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

}