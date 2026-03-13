import { Component, inject, OnInit } from '@angular/core';
import { ProjectStore } from '../../store/project.store';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../core/services/loading.service';
import { Table } from '../../components/table/table';

@Component({
  selector: 'app-project',
  imports: [CommonModule, Table],
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class Project implements OnInit {

  projectStore = inject(ProjectStore);
  loader = inject(LoaderService)

  constructor() {}

  ngOnInit(): void {
    this.projectStore.getProjects();
  }
}
