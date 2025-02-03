import { state } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {  SelectModule } from 'primeng/select';
import { StateService } from 'src/app/services/state.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { RatingModule } from 'primeng/rating';
import { Book, BookLogProgress } from 'src/models/book';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'book-streak-add-book-form',
  standalone: true,
  imports: [
    CommonModule,
    SelectModule,
    FormsModule,
    FloatLabelModule,
    ButtonModule,
    InputTextModule,
    InputNumber,
    ReactiveFormsModule,
    RatingModule,
    DialogModule,
  ],
  templateUrl: './add-book-form.component.html',
  styleUrl: './add-book-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBookFormComponent implements OnInit {
  stateService = inject(StateService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  initialState:Book = {
    id: '',
    author: '',
    title: '',
    image: '',
    rating: 0,
    progress: 0,
    totalPage: 1,
    logs: []
  }

  authors: string[] = [];
  authorDialogVisible = false;

  formGroup: FormGroup<any> = new FormGroup({
    id: new FormControl<string>(''),
    author: new FormControl<string>('', Validators.required),
    title: new FormControl<string>('', Validators.required),
    image: new FormControl<string>(''),
    rating: new FormControl<number>(0),
    progress: new FormControl<number>(0),
    totalPage: new FormControl<number>(1),
    logs: new FormControl<any[]>([]),
  });
  errorMessage: string = '';
  ngOnInit(): void {
    if (this.route.snapshot.params['id']) this.loadBook(this.route.snapshot.params['id']);

    this.stateService.getAuthors().subscribe((authors) => {
      this.authors = Array.from(authors);
    });

    this.formGroup.valueChanges.subscribe((value) => {
      if (value.progress > value.totalPage) {
        this.errorMessage =
          'La página actual no puede ser mayor que la cantidad de páginas';
      } else this.errorMessage = '';
    });


  }

  loadBook(id:string){
    let book = this.stateService.getBookById(id);
    if (!book) return;
    this.initialState = book;
    this.formGroup.patchValue(book);
  }

  submit() {
    let book = this.formGroup.value as Book;

    if (book.id) this.updateBookSubmit(book);

    else if (!book.id) this.newBookSubmit(book);

    this.router.navigate(['/']);
  }

  newBookSubmit(book:Book) {
      this.stateService.addNewBook(book);
  }
  updateBookSubmit(book:Book){
    let log;
    if (this.initialState.progress != book.progress) {
      log = {
        currentPage: book.progress,
        initialPage: this.initialState.progress,
        date: new Date(),
        message: `Leyó ${book.progress - this.initialState.progress} página(s)`,
        type: 'progress',
      } as BookLogProgress;
      book.logs.push(log);
    }

    this.stateService.updateBook(book);
  }

  addAuthor(author:string) {
    let setAuthor:Set<string> = new Set(this.authors);
    setAuthor.add(author);
    this.authors = Array.from(setAuthor);
    this.formGroup.controls['author'].setValue(author);
    this.authorDialogVisible = false;
  }
}
