import { Component, inject, OnInit } from '@angular/core';
import { ProjectStore } from '../../store/project.store';
import { TaskStore } from '../../store/task.store';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  projectStore = inject(ProjectStore);
  taskStore = inject(TaskStore);

  ngOnInit(): void {
    this.projectStore.getProjects();
    this.taskStore.getTasks();
    console.log('tasks', this.taskStore.total())
  }
}
