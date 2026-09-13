import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TypingResult {
  id?: number;
  wpm: number;
  accuracy: number;
  correctCharacters: number;
  incorrectCharacters: number;
  errors: number;
  duration: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  private apiUrl = 'https://simple-typing-test.onrender.com/api/results';

  constructor(private http: HttpClient) {}

  saveResult(result: TypingResult): Observable<TypingResult> {
    return this.http.post<TypingResult>(
      this.apiUrl,
      result
    );
  }

  getResults(): Observable<TypingResult[]> {
  return this.http.get<TypingResult[]>(this.apiUrl);
}

getResultById(id: number): Observable<TypingResult> {
  return this.http.get<TypingResult>(`${this.apiUrl}/${id}`);
}

deleteResult(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
}