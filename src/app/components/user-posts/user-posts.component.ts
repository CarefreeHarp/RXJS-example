import { Component, Input } from '@angular/core';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';

@Component({
  selector: 'app-user-posts',
  imports: [],
  templateUrl: './user-posts.component.html',
  styleUrl: './user-posts.component.scss'
})
export class UserPostsComponent {
  @Input({ required: true }) posts: Post[] = [];
  @Input({ required: true }) comments: Comment[] = [];

  // Los comentarios llegan juntos desde el componente principal; cada post muestra solo los suyos.
  commentsOf(postId: number): Comment[] {
    return this.comments.filter(comment => comment.postId === postId);
  }
}
