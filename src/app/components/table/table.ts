import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableSchema } from '../../core/interfaces/project.interface';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  
  @Input() tableData: TableSchema = {
    rows: [],
    cols: []
  };

  constructor() {}

  dynamicClass(priority: string) {
    return {
      'priotity-low': priority === 'Low',
      'priotity-medium': priority === 'Medium',
      'priotity-high': priority === 'High',
      'priotity-critical': priority === 'Critical'
    }
  }
}
