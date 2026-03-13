import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidenav } from '../components/sidenav/sidenav';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { AuthStore } from '../store/auth.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidenav, Header, Footer, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

  store = inject(AuthStore);
  constructor() {
    console.log('loader', this.store.isLoading())
  }
}
