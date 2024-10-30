import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ConfirmationDialogData } from './confirmation-dialog-data';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatButtonModule,
    MatDialogTitle,
    MatIcon,
  ],
  templateUrl: './dialog-confirmation.component.html',
  //   styleUrls: ['./confirm.component.css'],
})
export class DialogConfirmationComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) {}

  ngOnInit(): void {}
}
