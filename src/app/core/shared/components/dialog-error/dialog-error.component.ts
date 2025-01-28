import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-error',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatButtonModule,
    MatDialogTitle,
  ],
  templateUrl: './dialog-error.component.html',
  styleUrl: './dialog-error.component.scss',
})
export class DialogErrorComponent {
  data = inject(MAT_DIALOG_DATA);
}
