import { Component, Input } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-details',
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  @Input({ required: true }) user: User | undefined;
}
