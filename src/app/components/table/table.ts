import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Output() sendRowData = new EventEmitter<any>();

  constructor() {}

  dynamicClass(priority: string) {
    return {
      'priotity-low': priority === 'Low',
      'priotity-medium': priority === 'Medium',
      'priotity-high': priority === 'High',
      'priotity-critical': priority === 'Critical'
    }
  }

  openDialogPopup(row: any, type: string) {
    this.sendRowData.emit({ row, type });
  }
}
