import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorComponent } from './dialog-error.component';

@Injectable({
  providedIn: 'root',
})
export class DialogErrorService {
  private opened = false;

  constructor(private dialog: MatDialog) {}

  openDialog(
    heading: string,
    message: string,
    status?: number,
    title?: string,
  ): void {
    if (!this.opened) {
      this.opened = true;
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        data: { heading, message, status, title },
        maxHeight: '100%',
        width: '540px',
        maxWidth: '100%',
        disableClose: true,
        hasBackdrop: true,
      });

      dialogRef.afterClosed().subscribe(() => {
        this.opened = false;
      });
    }
  }
}
