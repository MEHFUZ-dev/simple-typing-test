import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ResultService, TypingResult } from '../core/services/result';
import { AuthService } from '../core/services/auth';
import { Navbar } from '../shared/navbar/navbar';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [RouterLink, Navbar],
  templateUrl: './results.html',
  styleUrl: './results.css'
})
export class Results {
  constructor(
    private resultService: ResultService,
    private authService: AuthService
  ) {
    if (this.authService.isLoggedIn()) {
      this.saveResult();
    }
  }

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  wpm = Number(this.route.snapshot.queryParamMap.get('wpm')) || 0;
  accuracy = Number(this.route.snapshot.queryParamMap.get('accuracy')) || 0;
  correct = Number(this.route.snapshot.queryParamMap.get('correct')) || 0;
  incorrect = Number(this.route.snapshot.queryParamMap.get('incorrect')) || 0;
  duration = Number(this.route.snapshot.queryParamMap.get('duration')) || 30;

  restartTest(): void {
    this.router.navigate(['/typing-test']);
  }

  goDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  saveResult(): void {

    const result: TypingResult = {
      wpm: this.wpm,
      accuracy: this.accuracy,
      correctCharacters: this.correct,
      incorrectCharacters: this.incorrect,
      errors: this.incorrect,
      duration: this.duration
    };

    this.resultService.saveResult(result).subscribe({
      next: (response) => {
        console.log('Result saved:', response);
      },
      error: (error) => {
        console.error('Failed to save result:', error);
      }
    });
  }

  isLoggedIn(): boolean {
  return this.authService.isLoggedIn();
}
}