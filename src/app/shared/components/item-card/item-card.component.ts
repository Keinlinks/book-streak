import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, type OnInit } from '@angular/core';
import { Book } from '../../../../models/book';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { KnobModule } from 'primeng/knob';

@Component({
  selector: 'book-streak-item-card',
  standalone: true,
  imports: [CommonModule, RatingModule, FormsModule, KnobModule],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardComponent implements OnInit {
  @Input() item!: Book;
  @Input() styles?: { [key: string]: string };
  _percentage = 0;

  get percentage(){
    let percentage = (this.item.progress * 100) / this.item.totalPage;
    return Math.round(percentage);
  }


  ngOnInit(): void {}
}
