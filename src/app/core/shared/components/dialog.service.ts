import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogData } from './dialog-confirm/confirmation-dialog-data';
import { DialogConfirmationComponent } from './dialog-confirm/dialog-confirmation.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  confirmationDialog(data: ConfirmationDialogData): Observable<boolean> {
    return this.dialog
      .open(DialogConfirmationComponent, {
        data,
        width: '400px',
        disableClose: true,
      })
      .afterClosed();
  }
}
