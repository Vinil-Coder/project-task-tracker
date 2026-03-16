import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectModel } from '../../core/interfaces/project.interface';
import { TaskModel } from '../../core/interfaces/task.interface';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {

  @Input() placeholder: string = '';
  @Input() data: ProjectModel[] | TaskModel[] = [];
  @Output() searchResults = new EventEmitter<any[]>();

  onSearch(value: string) {
    if (value) {
      const searchResults = this.data.filter(item => {
        return Object.keys(item).some(key => {
          return String(item[key as keyof typeof item]).toLowerCase().includes(value.toLowerCase());
        });
      });
      this.searchResults.emit(searchResults);
    } else {
      this.searchResults.emit(this.data);
    }
  }
}
