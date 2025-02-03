import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, type OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BookLogBase, BookLogFinished, BookLogProgress } from 'src/models/book';

@Component({
  selector: 'book-streak-log-card',
  standalone: true,
  imports: [
    CommonModule,
    CardModule
  ],
  templateUrl: './log-card.component.html',
  styleUrl: './log-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogCardComponent implements OnInit {
  @Input() log!:BookLogBase | BookLogProgress | BookLogFinished

  title:string = "";
  ngOnInit(): void {
    switch (this.log.type){
      case 'new':
        this.title = "Nuevo libro agregado"
        break;
      case 'progress':
        this.title = "Progreso del libro"
        break;
      case 'finished':
        this.title = "Libro terminado"
        break;
    }

  }

}
