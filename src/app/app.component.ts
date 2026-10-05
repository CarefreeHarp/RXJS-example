import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, forkJoin, map, of, Subject, switchMap } from 'rxjs';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserPostsComponent } from './components/user-posts/user-posts.component';
import { User } from './models/user';
import { Post } from './models/post';
import { Comment } from './models/comment';
import { UserService } from './services/user.service';
import { PostService } from './services/post.service';
import { CommentService } from './services/comment.service';

@Component({
  selector: 'app-root',
  imports: [SearchBarComponent, UserDetailsComponent, UserPostsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly userService = inject(UserService);
  private readonly postService = inject(PostService);
  private readonly commentService = inject(CommentService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly username$ = new Subject<string>();

  user: User | undefined;
  posts: Post[] = [];
  comments: Comment[] = [];
  isLoading = false;
  isDarkMode = false;
  message = '';

  constructor() {
    const result$ = this.username$.pipe(
      switchMap(username => {
        this.user = undefined;
        this.posts = [];
        this.comments = [];
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
              return of({ user: undefined, posts: [], comments: [] });
            }

            return this.postService.getByUserId(user.id).pipe(
              map(response => response.posts),
              switchMap(posts => {
                // forkJoin no emite con un arreglo vacío: sin posts no hay comentarios que pedir.
                if (posts.length === 0) {
                  return of({ user, posts, comments: [] });
                }

                // Pide los comentarios de todos los posts a la vez y espera a que lleguen todos.
                return forkJoin(posts.map(post => this.commentService.getByPostId(post.id))).pipe(
                  map(responses => ({ user, posts, comments: responses.flatMap(response => response.comments) }))
                );
              })
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
        this.comments = result.comments;
        this.isLoading = false;
        this.message = result.user ? '' : 'Usuario no encontrado.';
      }
    });
  }

  onSearch(username: string): void {
    this.username$.next(username.trim());
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }
}
