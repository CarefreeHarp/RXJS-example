import { Component, Input } from '@angular/core';
import { Post } from '../../models/post';

@Component({
  selector: 'app-user-posts',
  imports: [],
  templateUrl: './user-posts.component.html',
  styleUrl: './user-posts.component.scss'
})
export class UserPostsComponent {
  @Input({ required: true }) posts: Post[] = [];
}
