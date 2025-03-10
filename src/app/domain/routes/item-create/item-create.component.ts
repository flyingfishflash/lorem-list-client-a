import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { coerceEmptyStringToNull } from '../../../core/shared/coerce-empty-string-to-null.function';
import { DialogGeneralComponent } from '../../../core/shared/components/dialog-general/dialog-general.component';
import { Logger } from '../../../core/shared/logging/logger';
import { MATCH_STRING_OF_WHITE_SPACE } from '../../../core/shared/regex-pattern-validations.contants';
import { ItemCreateRequest } from '../../model/item-create-request';
import { ListItemsService } from '../../services/api/list-items.service';

@Component({
  selector: 'app-item-create',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './item-create.component.html',
  styleUrl: './item-create.component.scss',
})
export class ItemCreateComponent {
  readonly #dialog = inject(MatDialog);
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #itemService = inject(ListItemsService);
  readonly #logger = new Logger('item-create.component');
  readonly #snackBar = inject(MatSnackBar);

  //  eslint-disable-next-line @typescript-eslint/member-ordering
  createItemForm = this.#formBuilder.group({
    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(64),
        Validators.pattern(MATCH_STRING_OF_WHITE_SPACE),
      ],
    ],
    description: [
      '',
      [
        Validators.maxLength(2048),
        Validators.pattern(MATCH_STRING_OF_WHITE_SPACE),
      ],
    ],
    quantity: [0, [Validators.min(0)]],
  });

  onSubmit(formDirective: { resetForm: () => void }): void {
    if (this.createItemForm.valid) {
      // form is valid
      const postData: ItemCreateRequest = {
        name: this.createItemForm.getRawValue().name,
        description: coerceEmptyStringToNull(
          this.createItemForm.getRawValue().description,
        ),
        quantity: this.createItemForm.getRawValue().quantity,
        isSuppressed: false,
      };

      this.#itemService.postItem('blah', postData).subscribe({
        next: (serviceResponse) => {
          this.#logger.debug(serviceResponse);
          const dialogRef = this.#dialog.open(DialogGeneralComponent, {
            data: {
              title: 'Item Created',
              message: serviceResponse,
            },
          });
          dialogRef.afterClosed().subscribe(() => {
            formDirective.resetForm();
            this.createItemForm.reset();
          });
        },
        error: () => {
          // this.#logger.debug('', error);
        },
      });
    } else {
      // form is invalid
      this.#snackBar.open('Please resolve any form errors.', 'OK', {
        duration: 8000,
      });
    }
  }
}
