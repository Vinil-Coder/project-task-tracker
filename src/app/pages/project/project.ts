import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { ProjectStore } from '../../store/project.store';
import { CommonModule } from '@angular/common';
import { AppUiStateService } from '../../core/services/app-ui-state.service';
import { Table } from '../../components/table/table';
import { DialogPopup } from '../../components/dialog-popup/dialog-popup';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectModel } from '../../core/interfaces/project.interface';
import { Search } from '../../components/search/search';
import { TableSchema } from '../../core/interfaces/task.interface';

@Component({
  selector: 'app-project',
  imports: [CommonModule, Table, DialogPopup, Search, ReactiveFormsModule],
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class Project {

  placeholder = 'Search project' as string;
  form = {} as FormGroup;
  project = {} as ProjectModel;
  actionType = '' as string;

  store = inject(ProjectStore);
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
      priority: ['', Validators.required],
      status: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    })
    this.store.tableData().rows = this.store.projects()
  }

  get f() {
    return this.form.controls;
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

    this.form.markAllAsTouched();

    if (this.form.invalid) return;

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
    this.store.addProject(
      this.form.value,
      () => {
        this.toggleDialogForm();
      }
    );
  }

  updateProject(): void {
    const formData = this.form.value;
    formData.id = this.project.id;

    this.store.updateProject(
      formData,
      () => {
        this.toggleDialogForm();
      }
    );
  }

  deleteProject(): void {
    this.store.deleteProject(
      this.project,
      () => {
        this.toggleDialogForm();
      }
    );
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

  @ViewChild('priorityDropdown') priorityDropdown!: ElementRef;
  @ViewChild('statusDropdown') statusDropdown!: ElementRef;

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {

    if (this.priorityDropdown &&
      !this.priorityDropdown.nativeElement.contains(event.target)) {
      this.priorityDropdownOpen = false;
    }

    if (this.statusDropdown &&
      !this.statusDropdown.nativeElement.contains(event.target)) {
      this.statusDropdownOpen = false;
    }
  }

  openFilterDialog() {
    this.app.showFilter.set(!this.app.showFilter());
    this.toggleDialogForm();
  }

  openFormDialog() {
    this.initializeEmptyVariables();
    this.app.showForm.set(true);
    this.toggleDialogForm();
  }

  onRowClick(tableRow: { row: ProjectModel, type: string }) {

    this.initializeEmptyVariables();

    this.app.showForm.set(true);   // always open

    if (tableRow.type !== 'add') {
      this.actionType = tableRow.type;
      this.project = tableRow?.row;

      this.form.patchValue({
        title: this.project.title,
        description: this.project.description,
        priority: this.project.priority,
        status: this.project.status,
        startDate: this.project.startDate?.split('T')[0],
        endDate: this.project.endDate?.split('T')[0]
      });

      this.selectedPriority = this.project.priority;
      this.selectedStatus = this.project.status;
    }

    this.toggleDialogForm();
  }

  initializeEmptyVariables() {
    this.form.reset();
    this.actionType = 'add';
    this.project = {} as ProjectModel;

    this.priorityDropdownOpen = false;
    this.statusDropdownOpen = false;

    this.selectedPriority = 'Select Priority';
    this.selectedStatus = 'Select Status';
  }

  toggleDialogForm() {
    const dialogOverlay = document.querySelector('.dialog-overlay');
    dialogOverlay?.classList.toggle('show');
  }

  updateTableData(results: ProjectModel[]) {
    this.store.tableData().rows = results;
  }
}
