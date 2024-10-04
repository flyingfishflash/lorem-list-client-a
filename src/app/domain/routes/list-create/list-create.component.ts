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
import { ListCreateRequest } from '../../model/list-create-request';
import { ListsService } from '../../services/api/lists.service';

@Component({
  selector: 'app-list-create',
  templateUrl: './list-create.component.html',
  styleUrl: './list-create.component.scss',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
})
export class ListCreateComponent {
  readonly #dialog = inject(MatDialog);
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #listService = inject(ListsService);
  readonly #logger = new Logger('list-create.component');
  readonly #snackBar = inject(MatSnackBar);

  //  eslint-disable-next-line @typescript-eslint/member-ordering
  createListForm = this.#formBuilder.group({
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
    public: [false],
  });

  onSubmit(formDirective: { resetForm: () => void }): void {
    if (this.createListForm.valid) {
      // form is valid
      const postData: ListCreateRequest = {
        name: this.createListForm.getRawValue().name,
        description: coerceEmptyStringToNull(
          this.createListForm.getRawValue().description,
        ),
        public: this.createListForm.getRawValue().public,
      };

      this.#listService.postList(postData).subscribe({
        next: (serviceResponse) => {
          this.#logger.debug(serviceResponse);
          const dialogRef = this.#dialog.open(DialogGeneralComponent, {
            data: {
              title: 'List Created',
              message: serviceResponse,
            },
          });
          dialogRef.afterClosed().subscribe(() => {
            formDirective.resetForm();
            this.createListForm.reset();
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
