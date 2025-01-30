import { Book } from "./book";

export interface State {
  streak: number;
  haveBeenReadToday: boolean;
  books: Book[];
  lastDaySaved: Date | null;
}
