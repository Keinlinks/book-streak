import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { StateService } from '../../services/state.service';
import { ItemCardComponent } from './components/item-card/item-card.component';
import { Book, BookLogProgress } from '../../../models/book';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'book-streak-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ItemCardComponent,
    RouterLink,
    DialogModule,
    InputNumberModule,
    FloatLabelModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  streak = 0;
  haveBeenReadToday = false;
  books: Book[] = [];

  bookProgress:Book = {
    author: '',
    logs: [],
    image: '',
    progress: 0,
    rating: 0,
    title: '',
    totalPage: 0,
  };
  showProgressDialog = false;
  dialogErrorMessage = '';
  dialogInput = 0;

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
      this.cd.detectChanges();
    });
  }

  haveReadToday() {
    this.stateService.haveReadToday();
    this.stateService.streakPlus();
    this.cd.detectChanges();
  }

  addProgress(book: Book,currentPage:number) {
    this.dialogInput = 0;
    this.showProgressDialog = false;
    if (!book.id) return;
    if (currentPage > book.totalPage) return;
    if (currentPage <= book.progress) return;

    let log:BookLogProgress = {
      currentPage,
      initialPage: book.progress,
      date: new Date(),
      message: `Leyó ${currentPage - book.progress} página(s)`,
      type: 'progress',
    };

    book.progress = currentPage;
    this.stateService.updateBook(book,log);
  }
}
