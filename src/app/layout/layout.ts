import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidenav } from '../components/sidenav/sidenav';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { CommonModule } from '@angular/common';
import { AppUiStateService } from '../core/services/app-ui-state.service';
import { Toastr } from '../components/toastr/toastr';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidenav, Header, Footer, Toastr, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

  app = inject(AppUiStateService);
}
