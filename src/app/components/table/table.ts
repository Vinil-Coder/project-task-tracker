import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TableSchema } from '../../core/interfaces/project.interface';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table implements OnInit {
  
  @Input() tableData: TableSchema = {
    rows: [],
    cols: []
  };

  constructor() {}

  ngOnInit(): void {
    console.log('table', this.tableData)
  }
}
