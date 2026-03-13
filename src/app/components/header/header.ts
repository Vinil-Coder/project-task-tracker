import { Component, inject } from '@angular/core';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  store = inject(AuthStore);

  logout() {
    this.store.logout();
  }

  toogleSidebar() {
    console.log('toogleSidebar');
    const sidenavElement = document.getElementById('sidenav');
    const headerElement = document.getElementById('header');
    const mainElement = document.getElementById('main');
    sidenavElement?.classList.toggle('hide');
    headerElement?.classList.toggle('full-screen');
    mainElement?.classList.toggle('full-screen');
  }
}
