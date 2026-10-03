import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://dummyjson.com/posts';

  getById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  getByUserId(userId: number): Observable<{ posts: Post[] }> {
    return this.http.get<{ posts: Post[] }>(`${this.apiUrl}/user/${userId}`);
  }
}
