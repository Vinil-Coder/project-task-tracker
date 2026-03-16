import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-filter',
  imports: [CommonModule],
  templateUrl: './filter.html',
  styleUrl: './filter.css',
})
export class Filter {

  @Input() data = [] as any[];
  @Output() filterResults = new EventEmitter<any[]>();

  constructor() { }

  priorityDropdownOpen = false;
  selectedPriority = 'Select Priority';
  isPrioritySelected = false;
  isStatusSelected = false;

  togglePriorityDropdown(event: Event) {
    event.stopPropagation();   // prevents parent click
    this.priorityDropdownOpen = !this.priorityDropdownOpen;
  }

  selectPriority(value: string, event: Event) {
    event.stopPropagation();   // prevents parent click

    this.selectedPriority = value;
    this.priorityDropdownOpen = false;
    this.isPrioritySelected = true;
  }

  statusDropdownOpen = false;
  selectedStatus = 'Select Status';

  toggleStatusDropdown(event: Event) {
    event.stopPropagation();   // prevents parent click
    this.statusDropdownOpen = !this.statusDropdownOpen;
  }

  selectStatus(value: string, event: Event) {
    event.stopPropagation();   // prevents parent click

    this.selectedStatus = value;
    this.statusDropdownOpen = false;
    this.isStatusSelected = true;
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

  applyFilters(): void {
    console.log('data', this.data);
    console.log('selectedPriority', this.selectedPriority);
    console.log('selectedStatus', this.selectedStatus);

    const filteredData = this.data.filter(item => {
      
      if (this.isPrioritySelected) {
        return item.priority === this.selectedPriority;
      }
      if (this.isStatusSelected) {
        return item.status === this.selectedStatus;
      }
      return true;
    })
    console.log('filteredData', filteredData);
    this.filterResults.emit(filteredData);
  }

  resetFilters(): void {
    this.selectedPriority = 'Select Priority';
    this.selectedStatus = 'Select Status';
  }
}
