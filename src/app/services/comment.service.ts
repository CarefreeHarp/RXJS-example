import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://dummyjson.com/comments';

  getByPostId(postId: number): Observable<{ comments: Comment[] }> {
    return this.http.get<{ comments: Comment[] }>(`${this.apiUrl}/post/${postId}`);
  }
}
