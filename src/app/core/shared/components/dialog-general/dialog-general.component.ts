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
  selector: 'app-dialog-general',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatButtonModule,
    MatDialogTitle,
  ],
  templateUrl: './dialog-general.component.html',
  styleUrl: './dialog-general.component.scss',
})
export class DialogGeneralComponent {
  data = inject(MAT_DIALOG_DATA);
}
