import { Component, inject } from '@angular/core';
import { AppUiStateService } from '../../core/services/app-ui-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toastr',
  imports: [CommonModule],
  templateUrl: './toastr.html',
  styleUrl: './toastr.css',
})
export class Toastr {

  app = inject(AppUiStateService);

}
