import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [RouterModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {

  toggleMenu() {

    const screenWidth = Number(window.visualViewport?.width.toFixed(0));

    if (screenWidth <= 1024) {
      const sidenavElement = document.getElementById('sidenav');
      sidenavElement?.classList.add('hide');
    }
  }
}
