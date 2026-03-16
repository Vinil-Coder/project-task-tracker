import { Component, inject, OnInit } from '@angular/core';
import { ProjectStore } from '../../store/project.store';
import { TaskStore } from '../../store/task.store';
import { AuthStore } from '../../store/auth.store';
import { ActivityStore } from '../../store/activity.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  project = inject(ProjectStore);
  task = inject(TaskStore);
  auth = inject(AuthStore);
  activity = inject(ActivityStore);

  ngOnInit(): void {
    this.activity.getActivities();
  }
}
