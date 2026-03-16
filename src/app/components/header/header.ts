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
    const width = Number(window.visualViewport?.width.toFixed(0));
    if (width <= 1024) {
      const sidenavElement = document.getElementById('sidenav');
      sidenavElement?.classList.toggle('hide');
    } else {
      const headerElement = document.getElementById('header');
      headerElement?.classList.toggle('full-screen');

      const mainElement = document.getElementById('main');
      mainElement?.classList.toggle('full-screen');

      const sidenavElement = document.getElementById('sidenav');
      sidenavElement?.classList.toggle('hide');
    }
  }
}
