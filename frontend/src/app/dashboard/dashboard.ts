import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../shared/navbar/navbar';
import { DatePipe } from '@angular/common';

import {
  ResultService,
  TypingResult
} from '../core/services/result';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, Navbar, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  results = signal<TypingResult[]>([]);

  totalTests = signal(0);
  bestWpm = signal(0);
  bestAccuracy = signal(0);
  averageWpm = signal(0);
  averageAccuracy = signal(0);
  personalBest = signal<number>(0);

  constructor(
    private resultService: ResultService
  ) { }

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {

    this.resultService.getResults().subscribe({

      next: (data) => {

        this.results.set(data);

        this.totalTests.set(data.length);

        if (data.length > 0) {

          // Best WPM
          const best = Math.max(...data.map(result => result.wpm));

          this.bestWpm.set(best);
          this.personalBest.set(best);

          // Best Accuracy
          this.bestAccuracy.set(
            Math.max(...data.map(result => result.accuracy))
          );

          // Average WPM
          const totalWpm = data.reduce(
            (sum, result) => sum + result.wpm,
            0
          );

          this.averageWpm.set(
            Math.round(totalWpm / data.length)
          );

          // Average Accuracy
          const totalAccuracy = data.reduce(
            (sum, result) => sum + result.accuracy,
            0
          );

          this.averageAccuracy.set(
            Math.round(totalAccuracy / data.length)
          );

        } else {

          this.bestWpm.set(0);
          this.personalBest.set(0);
          this.bestAccuracy.set(0);
          this.averageWpm.set(0);
          this.averageAccuracy.set(0);

        }

      },

      error: (error) => {
      }

    });

  }

}