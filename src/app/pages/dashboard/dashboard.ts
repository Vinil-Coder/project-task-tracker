import { Component, inject, OnInit } from '@angular/core';
import { ProjectStore } from '../../store/project.store';
import { TaskStore } from '../../store/task.store';
import { AppUiStateService } from '../../core/services/app-ui-state.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  projectStore = inject(ProjectStore);
  taskStore = inject(TaskStore);
  app = inject(AppUiStateService)

  ngOnInit(): void {
    if (!this.projectStore.projects().length) {
      this.projectStore.getProjects();
    }
    if (!this.taskStore.tasks().length) {
      this.taskStore.getTasks();
    }
  }
}
