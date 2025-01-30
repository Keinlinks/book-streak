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
import { Book } from 'src/models/book';
import { Router } from '@angular/router';
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

  authors: string[] = [];
  authorDialogVisible = false;

  formGroup: FormGroup<any> = new FormGroup({
    author: new FormControl<string>('', Validators.required),
    title: new FormControl<string>('', Validators.required),
    image: new FormControl<string>(''),
    rating: new FormControl<number>(0),
    progress: new FormControl<number>(0),
    totalPage: new FormControl<number>(0),
  });
  errorMessage: string = '';
  ngOnInit(): void {
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

  submit() {
    let book = this.formGroup.value as Book;
    this.stateService.addNewBook(book);
    this.router.navigate(['/']);
  }

  addAuthor(author:string) {
    let setAuthor:Set<string> = new Set(this.authors);
    setAuthor.add(author);
    this.authors = Array.from(setAuthor);
    this.formGroup.controls['author'].setValue(author);
    this.authorDialogVisible = false;
  }
}
