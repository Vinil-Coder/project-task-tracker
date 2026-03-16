import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toastr } from './components/toastr/toastr';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toastr],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('project-task-tracker');
}
