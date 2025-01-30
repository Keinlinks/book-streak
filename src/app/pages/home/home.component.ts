import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { StateService } from '../../services/state.service';
import { ItemCardComponent } from '../../shared/components/item-card/item-card.component';
import { Book } from '../../../models/book';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'book-streak-home',
  standalone: true,
  imports: [CommonModule, ButtonModule,CardModule,ItemCardComponent,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  streak = 0;
  haveBeenReadToday = false;
  books: Book[] = [];

  stateService = inject(StateService);
  cd = inject(ChangeDetectorRef);
  ngOnInit(): void {
    this.stateService.getStreak().subscribe((value) => {
      this.streak = value;
    });
    this.stateService.getHaveBeenReadToday().subscribe((value) => {
      this.haveBeenReadToday = value;
    });
    this.stateService.getBooks().subscribe((value) => {
      this.books = value;
    });
  }

  haveReadToday(){
    this.stateService.haveReadToday();
    this.stateService.streakPlus();
    this.cd.detectChanges();
  }
}
