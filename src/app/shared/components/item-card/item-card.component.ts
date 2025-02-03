import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, Renderer2, ViewChild, type OnInit } from '@angular/core';
import { Book } from '../../../../models/book';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { KnobModule } from 'primeng/knob';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'book-streak-item-card',
  standalone: true,
  imports: [CommonModule, RatingModule, FormsModule, KnobModule, ButtonModule],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardComponent implements OnInit {
  router = inject(Router);
  render = inject(Renderer2);
  @Input() item!: Book;
  @Input() styles?: { [key: string]: string };
  @ViewChild('bookCard') bookCard!: any;
  unlistenerPointer!: (() => void) | undefined;
  unlistenerTouch!: (() => void) | undefined;
  unListenTouchEnd!: (() => void) | undefined;
  _percentage = 0;

  get percentage() {
    let percentage = (this.item.progress * 100) / this.item.totalPage;
    return Math.round(percentage);
  }

  ngOnInit(): void {}

  goToEdit() {
    this.router.navigate(['/add-book/' + this.item.id]);
  }
  goToLogs() {
    this.router.navigate(['/logs/' + this.item.id]);
  }
  startClickTime = 0;
  startClickPosition = 0;
  onPointerDown(event: PointerEvent | TouchEvent) {
    this.unListenAll();
    this.startClickTime = event.timeStamp;
    let startPosition: number = 0;
    if (event instanceof PointerEvent) {
      startPosition = event.clientX;
    } else if (event instanceof TouchEvent) {
      startPosition = event.touches[0].clientX;
    }
    this.startClickPosition = startPosition;
    this.startPointerDrag(startPosition);
    this.startTouchDrag(startPosition);
  }
  onPointerUp(event: PointerEvent | TouchEvent) {
    this.unListenAll();
    let element = this.bookCard.nativeElement as HTMLElement;
    element.style.transform = `translateX(0px)`;


    const endClick = event.timeStamp;
    const timeDiff = endClick - this.startClickTime;
    let endClickPosition = 0;
    const xDiff = endClickPosition - this.startClickPosition;
    if (xDiff < -100) {
      this.goToLogs();
      return;
    }
    if (timeDiff < 500) {
      this.goToEdit();
      return;
    }
    if (event instanceof PointerEvent) endClickPosition = event.clientX;
    else if (event instanceof TouchEvent)
      endClickPosition = event.changedTouches[0].clientX;



    this.startClickTime = 0;
  }

  startPointerDrag(x: number) {
    this.unlistenerPointer = this.render.listen(
      'document',
      'mousemove',
      (event) => {
        let element = this.bookCard.nativeElement as HTMLElement;
        if (event.clientX - x < 0)
          element.style.transform = `translateX(${event.clientX - x}px)`;
      }
    );
  }
  startTouchDrag(x: number) {
    this.unlistenerTouch = this.render.listen(
      'document',
      'touchmove',
      (event:TouchEvent) => {
        let element = this.bookCard.nativeElement as HTMLElement;
        if (event.touches[0].clientX - x < 0)
          element.style.transform = `translateX(${event.touches[0].clientX - x}px)`;
      }
    );
    this.unListenTouchEnd = this.render.listen('document', 'touchend', (event) => {
      this.onPointerUp(event);
    });
  }

  unListenAll(){
    if (this.unlistenerPointer) this.unlistenerPointer();
    if (this.unlistenerTouch) this.unlistenerTouch();
    if (this.unListenTouchEnd) this.unListenTouchEnd();
    this.unlistenerPointer = undefined;
    this.unListenTouchEnd = undefined;
    this.unlistenerTouch = undefined;
  }
}
