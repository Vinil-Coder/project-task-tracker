import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Table } from '../../components/table/table';
import { TaskStore } from '../../store/task.store';
import { LoaderService } from '../../core/services/loading.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskModel } from '../../core/interfaces/task.interface';
import { DialogPopup } from '../../components/dialog-popup/dialog-popup';

@Component({
  selector: 'app-task',
  imports: [CommonModule, Table, DialogPopup, ReactiveFormsModule],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {

  form = {} as FormGroup;
  task = {} as TaskModel;
  actionType = '' as string;

  store = inject(TaskStore);
  loader = inject(LoaderService)
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
  }

  ngOnInit(): void {
    if (this.store.tasks().length == 0) {
      this.store.getTasks();
    }
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
        priority: this.task.priority,
        status: this.task.status,
        startDate: this.task.startDate?.split('T')[0],
        endDate: this.task.endDate?.split('T')[0]
      })
    }
  }
}
