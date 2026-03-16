import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { Table } from '../../components/table/table';
import { TaskStore } from '../../store/task.store';
import { AppUiStateService } from '../../core/services/app-ui-state.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskModel } from '../../core/interfaces/task.interface';
import { DialogPopup } from '../../components/dialog-popup/dialog-popup';
import { ProjectStore } from '../../store/project.store';
import { ProjectModel } from '../../core/interfaces/project.interface';
import { Search } from '../../components/search/search';

@Component({
  selector: 'app-task',
  imports: [CommonModule, Table, DialogPopup, Search, ReactiveFormsModule],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {

  form = {} as FormGroup;
  task = {} as TaskModel;
  actionType = '' as string;
  placeholder = 'Search task' as string;

  store = inject(TaskStore);
  projectStore = inject(ProjectStore);
  app = inject(AppUiStateService)
  formBuilder = inject(FormBuilder);

  constructor() {
    this.form = this.formBuilder.group({
      title: ['', [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9 ]{8,12}$")
      ]],
      description: ['', [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9 ]{8,100}$")
      ]],
      project_id: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    })
    this.app.showToastr('Tasks fetched successfully');
  }

  get f() {
    return this.form.controls;
  }

  toggleDialogForm() {
    this.form.reset();
    this.actionType = 'add';
    this.task = {} as TaskModel;
    const dialogOverlay = document.querySelector('.dialog-overlay');
    dialogOverlay?.classList.toggle('show');
  }

  getFormTitle() {
    return this.actionType === 'edit'
      ? 'Edit Task'
      : this.actionType === 'view'
        ? 'Task Details'
        : this.actionType === 'delete'
          ? 'Delete Task'
          : 'Add Task';
  }

  getActionType() {
    return this.actionType;
  }

  onFormSubmit(): void {

    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    switch (this.actionType) {
      case 'edit':
        this.updateTask();
        break;
      case 'delete':
        this.deleteTask();
        break;
      default:
        this.addTask();
        break;
    }
  }

  addTask(): void {
    this.store.addTask(
      this.form.value,
      () => {
        this.toggleDialogForm();
      }
    );
  }

  updateTask(): void {
    const formData = this.form.value;
    formData.id = this.task.id;

    this.store.updateTask(
      formData,
      () => {
        this.toggleDialogForm();
      }
    );
  }

  deleteTask(): void {
    this.store.deleteTask(
      this.task,
      () => {
        this.toggleDialogForm();
      }
    );
  }

  onRowClick(tableRow: { row: any, type: string }) {
    console.log('Row Clicked', tableRow)
    this.toggleDialogForm();
    this.actionType = tableRow.type;
    this.task = tableRow.row;

    if (tableRow.type === 'edit') {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
        project_id: this.task.project_id,
        priority: this.task.priority,
        status: this.task.status,
        startDate: this.task.startDate?.split('T')[0],
        endDate: this.task.endDate?.split('T')[0]
      });
      this.selectedPriority = this.task.priority;
      this.selectedStatus = this.task.status;
      this.selectedProject = this.projectStore.projects()?.find(p => p.id === this.task.project_id)?.title || '';
    }
  }

  priorityDropdownOpen = false;
  selectedPriority = 'Select Priority';

  togglePriorityDropdown(event: Event) {
    event.stopPropagation();   // prevents parent click
    this.priorityDropdownOpen = !this.priorityDropdownOpen;
    this.form.get('priority')?.markAsTouched();
  }

  selectPriority(value: string, event: Event) {
    event.stopPropagation();   // prevents parent click

    this.selectedPriority = value;
    this.priorityDropdownOpen = false;
    this.form.patchValue({ priority: value });
    this.form.get('priority')?.markAsTouched();
  }

  statusDropdownOpen = false;
  selectedStatus = 'Select Status';

  toggleStatusDropdown(event: Event) {
    event.stopPropagation();   // prevents parent click
    this.statusDropdownOpen = !this.statusDropdownOpen;
    this.form.get('status')?.markAsTouched();
  }

  selectStatus(value: string, event: Event) {
    event.stopPropagation();   // prevents parent click

    this.selectedStatus = value;
    this.statusDropdownOpen = false;

    this.form.patchValue({ status: value });
    this.form.get('status')?.markAsTouched();
  }

  projectDropdownOpen = false;
  selectedProject = 'Select Project';

  toggleProjectDropdown(event: Event) {
    event.stopPropagation();   // prevents parent click
    this.projectDropdownOpen = !this.projectDropdownOpen;
    this.form.get('project_id')?.markAsTouched();
  }

  selectProject(value: ProjectModel, event: Event) {
    event.stopPropagation();   // prevents parent click

    this.selectedProject = value.title;
    this.projectDropdownOpen = false;

    this.form.patchValue({ project_id: value.id });
    this.form.get('project_id')?.markAsTouched();
  }

  @ViewChild('projectDropdown') projectDropdown!: ElementRef;
  @ViewChild('priorityDropdown') priorityDropdown!: ElementRef;
  @ViewChild('statusDropdown') statusDropdown!: ElementRef;

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {

    if (this.projectDropdown &&
      !this.projectDropdown.nativeElement.contains(event.target)) {
      this.projectDropdownOpen = false;
    }

    if (this.priorityDropdown &&
      !this.priorityDropdown.nativeElement.contains(event.target)) {
      this.priorityDropdownOpen = false;
    }

    if (this.statusDropdown &&
      !this.statusDropdown.nativeElement.contains(event.target)) {
      this.statusDropdownOpen = false;
    }
  }

  updateTableData(results: TaskModel[]) {
    this.store.tableData().rows = results;
  }
}
