import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidenav } from '../components/sidenav/sidenav';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../core/services/loading.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidenav, Header, Footer, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

  loader = inject(LoaderService);
}
