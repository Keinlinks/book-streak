import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'book-streak-setting',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule,RouterLink],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingComponent implements OnInit {
  editStreakDialogVisible = false;
  stateService = inject(StateService);


  ngOnInit(): void {

  }
  editStreak(value:number) {
    this.stateService.setStreak(value);
  }
}
