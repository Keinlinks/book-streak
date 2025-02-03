import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StateService } from 'src/app/services/state.service';
import { Book } from 'src/models/book';
import { LogCardComponent } from './components/log-card/log-card.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'book-streak-logs-book',
  standalone: true,
  imports: [
    CommonModule,
    LogCardComponent,
    ButtonModule,
    RouterLink
  ],
  templateUrl: './logs-book.component.html',
  styleUrl: './logs-book.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogsBookComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  stateService = inject(StateService);

  book:Book | undefined

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    this.book = this.stateService.getBookById(id);
    if (!this.book) this.router.navigate(['/'])

    this.book?.logs.reverse();

   }

}
