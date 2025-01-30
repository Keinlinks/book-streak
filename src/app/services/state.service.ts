import { Injectable } from "@angular/core";
import { BehaviorSubject, last, Observable } from "rxjs";
import { Book } from "../../models/book";
import { State } from "src/models/state";


@Injectable()
export class StateService {
  private $streak:BehaviorSubject<number> = new BehaviorSubject(0);
  private $haveBeenReadToday:BehaviorSubject<boolean> = new BehaviorSubject(false);
  private $books:BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);
  private $author:BehaviorSubject<Set<string>> = new BehaviorSubject<Set<string>>(new Set());
  private lastTimeSaved:Date | null = null;

  getStreak(){
    return this.$streak;
  }
  setStreak(value: number){
    this.$streak.next(value);
    this.saveState();
  }
  streakPlus(){
    this.$streak.next(this.$streak.value + 1);
    this.saveState();
  }
  getHaveBeenReadToday(){
    return this.$haveBeenReadToday;
  }
  haveReadToday(){
    this.$haveBeenReadToday.next(true);
    this.lastTimeSaved = new Date();
    this.saveState();
  }
  setHaveBeenReadToday(value: boolean){
    this.$haveBeenReadToday.next(value);
  }

  initNewState(){
    this.setStreak(0);
    this.saveState();
  }
  getBooks(){
    return this.$books;
  }
  addNewBook(book: Book){
    const books = this.$books.value;
    books.push(book);
    this.$books.next(books);
    this.verifyAuthors();
    this.saveState();
  }

  loadBooks(books: Book[]){
    this.$books.next(books);
    this.verifyAuthors();
  }

  loadState(state: State){
    this.$streak.next(state.streak);
    this.lastTimeSaved = new Date(state.lastDaySaved as any);
    let today = new Date();
    if (
      this.lastTimeSaved !== null &&
      this.lastTimeSaved.getDay() === today.getDay() &&
      this.lastTimeSaved.getMonth() === today.getMonth() &&
      this.lastTimeSaved.getFullYear() === today.getFullYear()
    ) {
      this.$haveBeenReadToday.next(true);
    }
    this.loadBooks(state.books);
  }

  saveState(){
    localStorage.setItem('appState', JSON.stringify({
      streak: this.$streak.value,
      haveBeenReadToday: this.$haveBeenReadToday.value,
      books: this.$books.value,
      lastDaySaved: this.lastTimeSaved,
    }));
  }

  verifyAuthors(){
    const authors = this.$books.value.map(book => book.author);
    this.$author.next(new Set(authors));
  }
  getAuthors(){
    return this.$author;
  }
}
