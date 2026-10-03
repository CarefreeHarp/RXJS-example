import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map, of, Subject, switchMap } from 'rxjs';
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
export class AppComponent {
  private readonly userService = inject(UserService);
  private readonly postService = inject(PostService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly username$ = new Subject<string>();

  user: User | undefined;
  posts: Post[] = [];
  isLoading = false;
  message = '';

  constructor() {
    const result$ = this.username$.pipe(
      switchMap(username => {
        this.user = undefined;
        this.posts = [];
        this.isLoading = false;
        this.message = '';

        if (!username) {
          this.message = 'Escribe un nombre de usuario.';
          return EMPTY;
        }

        this.isLoading = true;
        return this.userService.getByUsername(username).pipe(
          map(response => response.users[0]),
          switchMap(user => {
            if (!user) {
              return of({ user: undefined, posts: [] });
            }

            return this.postService.getByUserId(user.id).pipe(
              map(response => ({ user, posts: response.posts }))
            );
          }),
          catchError(() => {
            this.isLoading = false;
            this.message = 'No se pudo completar la búsqueda. Inténtalo de nuevo.';
            return EMPTY;
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    );

    result$.subscribe({
      next: result => {
        this.user = result.user;
        this.posts = result.posts;
        this.isLoading = false;
        this.message = result.user ? '' : 'Usuario no encontrado.';
      }
    });
  }

  onSearch(username: string): void {
    this.username$.next(username.trim());
  }
}
