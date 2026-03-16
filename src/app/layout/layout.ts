import { Component, Inject, inject, OnInit } from '@angular/core';
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
export class Layout implements OnInit {

  app = inject(AppUiStateService);

  constructor() { }

  ngOnInit() {
    console.log('Layout ngOnInit')
    const width = Number(window.visualViewport?.width.toFixed(0));
    if (width <= 1024) {
      const headerElement = document.getElementById('header');
      headerElement?.classList.add('full-screen');

      const mainElement = document.getElementById('main');
      mainElement?.classList.add('full-screen');

      const sidenavElement = document.getElementById('sidenav');
      sidenavElement?.classList.add('hide');
    }
  }
}
