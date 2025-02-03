import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnDestroy, Output, Renderer2, SimpleChanges, ViewChild, type OnInit } from '@angular/core';
import { Book } from '../../../../../models/book';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { KnobModule } from 'primeng/knob';
import { ButtonModule } from 'primeng/button';
import { Router,  } from '@angular/router';

@Component({
  selector: 'book-streak-item-card',
  standalone: true,
  imports: [CommonModule, RatingModule, FormsModule, KnobModule, ButtonModule],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardComponent implements OnInit, OnDestroy {
  router = inject(Router);
  render = inject(Renderer2);
  cd = inject(ChangeDetectorRef);
  @Input() item!: Book;
  @Input() styles?: { [key: string]: string };
  @Output() progressChange = new EventEmitter<Book>();
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
  ngOnDestroy(): void {
    this.unListenAll();
  }

  goToEdit() {
    this.router.navigate(['/add-book/' + this.item.id]);
  }
  goToLogs() {
    this.router.navigate(['/logs/' + this.item.id]);
  }

  startClickTime = 0;
  startClickPosition = 0;
  xDiff = 0;
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
    let endClickPosition = 0;
    const timeDiff = endClick - this.startClickTime;
    if (event instanceof PointerEvent) endClickPosition = event.clientX;
    else if (event instanceof TouchEvent)
      endClickPosition = event.changedTouches[0].clientX;
    const xDiff = endClickPosition - this.startClickPosition;

    if (xDiff < -100) {
      this.goToLogs();
      return;
    }
    else if (xDiff > 110){
      this.progressChange.emit(this.item);

    }
    else if (timeDiff < 500) {
      this.goToEdit();
      return;
    }
    this.startClickTime = 0;
    this.xDiff = 0;
  }

  startPointerDrag(x: number) {
    this.unlistenerPointer = this.render.listen(
      'document',
      'mousemove',
      (event) => {
        let element = this.bookCard.nativeElement as HTMLElement;
        element.style.transform = `translateX(${event.clientX - x}px)`;
        this.xDiff = event.clientX - x;
      }
    );
  }
  startTouchDrag(x: number) {
    this.unlistenerTouch = this.render.listen(
      'document',
      'touchmove',
      (event:TouchEvent) => {
        let element = this.bookCard.nativeElement as HTMLElement;
        element.style.transform = `translateX(${event.touches[0].clientX - x}px)`;
        this.xDiff = event.touches[0].clientX - x;
        this.cd.detectChanges();

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
