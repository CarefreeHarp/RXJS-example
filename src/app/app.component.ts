import { Component, inject, OnDestroy } from '@angular/core';
import { map, of, Subscription, switchMap } from 'rxjs';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserPostsComponent } from './components/user-posts/user-posts.component';
import { User } from './models/user';
import { Post } from './models/post';
import { UserService } from './services/user.service';
import { PostService } from './services/post.service';

@Component({
  selector: 'app-root',
  imports: [SearchBarComponent, UserDetailsComponent, UserPostsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  private readonly userService = inject(UserService);
  private readonly postService = inject(PostService);
  private searchSubscription: Subscription | undefined;

  user: User | undefined;
  posts: Post[] = [];
  isLoading = false;
  message = '';

  onSearch(username: string): void {
    this.searchSubscription?.unsubscribe();
    this.user = undefined;
    this.posts = [];
    this.isLoading = false;
    this.message = '';

    const value = username.trim();
    if (!value) {
      this.message = 'Escribe un nombre de usuario.';
      return;
    }

    this.isLoading = true;
    const result$ = this.userService.getByUsername(value).pipe(
      map(response => response.users[0]),
      switchMap(user => {
        if (!user) {
          return of({ user: undefined, posts: [] });
        }

        return this.postService.getByUserId(user.id).pipe(
          map(response => ({ user, posts: response.posts }))
        );
      })
    );

    this.searchSubscription = result$.subscribe({
      next: result => {
        this.user = result.user;
        this.posts = result.posts;
        this.isLoading = false;
        this.message = result.user ? '' : 'Usuario no encontrado.';
      },
      error: () => {
        this.isLoading = false;
        this.message = 'No se pudo completar la búsqueda. Inténtalo de nuevo.';
      }
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
}
