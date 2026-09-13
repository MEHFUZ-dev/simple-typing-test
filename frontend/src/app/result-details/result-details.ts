import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { ResultService, TypingResult } from '../core/services/result';
import { Navbar } from '../shared/navbar/navbar';

@Component({
  selector: 'app-result-details',
  standalone: true,
  imports: [Navbar, DatePipe],
  templateUrl: './result-details.html',
  styleUrl: './result-details.css'
})
export class ResultDetails implements OnInit {

  result = signal<TypingResult | null>(null);

  loading = signal(true);
  error = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resultService: ResultService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }

    this.resultService.getResultById(id).subscribe({
      next: (data) => {
        this.result.set(data);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Failed to load result:', error);
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  goHistory(): void {
    this.router.navigate(['/history']);
  }

  deleteResult(): void {

  const currentResult = this.result();

  if (!currentResult?.id) {
    return;
  }

  const confirmed = confirm(
    'Are you sure you want to delete this result?'
  );

  if (!confirmed) {
    return;
  }

  this.resultService.deleteResult(currentResult.id).subscribe({
    next: () => {
      this.router.navigate(['/history']);
    },
    error: (error) => {
      console.error('Failed to delete result:', error);
      alert('Failed to delete result.');
    }
  });
}
}