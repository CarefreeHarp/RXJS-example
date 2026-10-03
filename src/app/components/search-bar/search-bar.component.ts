import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();

  onSearch(event: Event, username: string): void {
    event.preventDefault();
    this.search.emit(username.trim());
  }
}
