import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StateService } from './services/state.service';
import { State } from '../models/state';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'book-streak';
  stateService = inject(StateService);
  ngOnInit(): void {

    const stateString = localStorage.getItem('appState');
    if (!stateString) {
      this.stateService.initNewState();
      return;
    }
    const state:State = JSON.parse(stateString);
    this.stateService.loadState(state);




  }
}
