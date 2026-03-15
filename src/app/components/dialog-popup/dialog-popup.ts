import { Component, inject } from '@angular/core';
import { LoaderService } from '../../core/services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-popup',
  imports: [CommonModule],
  templateUrl: './dialog-popup.html',
  styleUrl: './dialog-popup.css',
})
export class DialogPopup {

  loader = inject(LoaderService);
}
