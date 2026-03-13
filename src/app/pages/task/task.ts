import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Table } from '../../components/table/table';
import { TaskStore } from '../../store/task.store';
import { LoaderService } from '../../core/services/loading.service';

@Component({
  selector: 'app-task',
  imports: [CommonModule, Table],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {

  taskStore = inject(TaskStore);
  loader = inject(LoaderService);

  constructor() {}

  ngOnInit(): void {
    this.taskStore.getTasks();
  }
}
