import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://dummyjson.com/users';

  getByUsername(username: string): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(`${this.apiUrl}/filter`, {
      params: { key: 'username', value: username }
    });
  }
}
