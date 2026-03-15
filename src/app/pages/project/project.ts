import { Component, inject, OnInit, signal } from '@angular/core';
import { ProjectStore } from '../../store/project.store';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../core/services/loading.service';
import { Table } from '../../components/table/table';
import { DialogPopup } from '../../components/dialog-popup/dialog-popup';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectInterface } from '../../core/interfaces/project.interface';


@Component({
  selector: 'app-project',
  imports: [CommonModule, Table, DialogPopup, ReactiveFormsModule],
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class Project implements OnInit {

  projectForm = {} as FormGroup;
  project = {} as ProjectInterface;
  actionType = '' as string;

  projectStore = inject(ProjectStore);
  loader = inject(LoaderService)
  formBuilder = inject(FormBuilder);

  constructor() {
    this.projectForm = this.formBuilder.group({
      title: ['', [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9 ]{8,12}$")
      ]],
      description: ['', [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9 ]{8,100}$")
      ]],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    if (this.projectStore.projects().length == 0) {
      this.projectStore.getProjects();
    }
  }

  get f() {
    return this.projectForm.controls;
  }

  toggleDialogForm() {
    this.projectForm.reset();
    this.actionType = 'add';
    this.project = {} as ProjectInterface;
    const dialogOverlay = document.querySelector('.dialog-overlay');
    dialogOverlay?.classList.toggle('show');
  }

  getFormTitle() {
    return this.actionType === 'edit'
      ? 'Edit Project'
      : this.actionType === 'view'
        ? 'Project Details'
        : this.actionType === 'delete'
          ? 'Delete Project'
          : 'Add Project';
  }

  getActionType() {
    return this.actionType;
  }

  onFormSubmit(): void {

    this.projectForm.markAllAsTouched();

    if (this.projectForm.invalid) return;

    switch (this.actionType) {
      case 'edit':
        this.updateProject();
        break;
      case 'delete':
        this.deleteProject();
        break;
      default:
        this.addProject();
        break;
    }
  }

  addProject(): void {
    this.projectStore.addProject(
      this.projectForm.value,
      () => {
        this.toggleDialogForm();
      }
    );
  }

  updateProject(): void {
    const formData = this.projectForm.value;
    formData.id = this.project.id;

    this.projectStore.updateProject(
      formData,
      () => {
        this.toggleDialogForm();
      }
    );
  }

  deleteProject(): void {
    this.projectStore.deleteProject(
      this.project,
      () => {
        this.toggleDialogForm();
      }
    );
  }

  onRowClick(tableRow: { row: any, type: string }) {
    this.toggleDialogForm();
    this.actionType = tableRow.type;
    this.project = tableRow.row;

    if (tableRow.type === 'edit') {
      this.projectForm.patchValue({
        title: this.project.title,
        description: this.project.description,
        priority: this.project.priority,
        status: this.project.status,
        startDate: this.project.startDate?.split('T')[0],
        endDate: this.project.endDate?.split('T')[0]
      })
    }
  }
}
