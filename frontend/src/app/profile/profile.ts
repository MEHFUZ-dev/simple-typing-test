import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ProfileService, UserProfile } from '../core/services/profile';
import { ResultService, TypingResult } from '../core/services/result';
import { Navbar } from '../shared/navbar/navbar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe, Navbar],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  profile = signal<UserProfile | null>(null);

  // Statistics
  totalTests = signal<number>(0);
  bestWpm = signal<number>(0);
  averageWpm = signal<number>(0);
  bestAccuracy = signal<number>(0);

  constructor(
    private profileService: ProfileService,
    private resultService: ResultService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadStatistics();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
      },
      error: (error) => {
        console.error('Failed to load profile:', error);
      }
    });
  }

  loadStatistics(): void {
    this.resultService.getResults().subscribe({
      next: (results: TypingResult[]) => {

        // Total tests
        this.totalTests.set(results.length);

        // No results
        if (results.length === 0) {
          this.bestWpm.set(0);
          this.averageWpm.set(0);
          this.bestAccuracy.set(0);
          return;
        }

        // Best WPM
        const bestWpm = Math.max(
          ...results.map(result => result.wpm)
        );

        this.bestWpm.set(bestWpm);

        // Average WPM
        const totalWpm = results.reduce(
          (sum, result) => sum + result.wpm,
          0
        );

        const averageWpm = totalWpm / results.length;

        this.averageWpm.set(Math.round(averageWpm));

        // Best Accuracy
        const bestAccuracy = Math.max(
          ...results.map(result => result.accuracy)
        );

        this.bestAccuracy.set(bestAccuracy);
      },

      error: (error) => {
        console.error('Failed to load statistics:', error);
      }
    });
  }
}