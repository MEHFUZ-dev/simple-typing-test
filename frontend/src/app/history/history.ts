import { Component, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  ResultService,
  TypingResult
} from '../core/services/result';
import { Navbar } from '../shared/navbar/navbar';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [DatePipe, RouterLink, Navbar],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class History implements OnInit {

  results = signal<TypingResult[]>([]);
  selectedDuration = signal<number | 'all'>('all');

  constructor(
    private resultService: ResultService
  ) {}

  filteredResults = computed(() => {
  const duration = this.selectedDuration();

  if (duration === 'all') {
    return this.results();
  }

  return this.results().filter(
    result => result.duration === duration
  );
});

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {

    this.resultService.getResults().subscribe({

      next: (data) => {


        this.results.set(data);



      },

      error: (error) => {
        console.error('Failed to load results:', error);
      }

    });

  }

}