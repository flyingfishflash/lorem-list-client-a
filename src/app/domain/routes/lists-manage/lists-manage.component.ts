import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  FormGroupDirective,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { coerceEmptyStringToNull } from '../../../core/shared/coerce-empty-string-to-null.function';
import { DialogService } from '../../../core/shared/components/dialog.service';
import { Logger } from '../../../core/shared/logging/logger';
import { YesNoPipe } from '../../../core/shared/pipes/yes-no.pipe';
import { MATCH_STRING_OF_WHITE_SPACE } from '../../../core/shared/regex-pattern-validations.contants';
import { ListCreateRequest } from '../../model/list-create-request';
import { LrmList } from '../../model/lrm-list';
import { LrmListPatchRequest } from '../../model/lrm-list-patch-request';
import { ListsService } from '../../services/api/lists.service';
import { MatTableResponsiveDirective } from './mat-table-responsive.directive';

@Component({
  selector: 'app-lists-manage',
  templateUrl: './lists-manage.component.html',
  styleUrl: './lists-manage.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    MatError,
    MatFormField,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTableResponsiveDirective,
    MatTooltip,
    ReactiveFormsModule,
    YesNoPipe,
  ],
})
export class ListsManageComponent implements OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('nameInput') nameInput!: ElementRef;

  dataSource = new MatTableDataSource<LrmList>();
  dataSource$: Observable<MatTableDataSource<LrmList>>;
  destroyed$ = new Subject<void>();
  displayedColumns: string[] = [];
  initalPaginatorPageSize: number = 0;
  isSmallerView: boolean | undefined;
  isListBeingEdited = false;
  isListBeingCreated = false;
  isSaveandCreateAnother = false;

  readonly #dialogService = inject(DialogService);
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #listService = inject(ListsService);
  readonly #logger = new Logger('list-manage.component');
  readonly #snackBar = inject(MatSnackBar);

  #currentRow: LrmList | null = null;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  formListManage = this.#formBuilder.group(
    {
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
    },
    { updateOn: 'submit' },
  );

  constructor() {
    this.#doLargerViewSettings();
    inject(BreakpointObserver)
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        // Breakpoints.Medium,
        Breakpoints.Handset,
        // Breakpoints.Tablet,
      ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result) => {
        console.log(result);
        if (
          this.isSmallerView == null ||
          this.isSmallerView !== result.matches
        ) {
          this.isSmallerView = result.matches;
          if (this.isSmallerView) this.#doSmallerViewSettings();
          else this.#doLargerViewSettings();
        }
      });

    const emptyLrmList: LrmList[] = [
      {
        id: '',
        name: '',
        description: '',
        public: false,
        created: '',
        createdBy: '',
        updated: '',
        updatedBy: '',
      },
    ];

    // subscription is managed by async pipe in html template
    this.dataSource$ = this.#listService.getLists().pipe(
      map((serviceResponse) => {
        // initialize dataSource as empty and set sort/pagination
        this.dataSource = new MatTableDataSource<LrmList>(emptyLrmList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log(this.initalPaginatorPageSize);
        this.dataSource.paginator.pageSize = this.initalPaginatorPageSize;
        this.dataSource.data = serviceResponse;
        return this.dataSource;
      }),
    );
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onCreateList() {
    this.isListBeingCreated = true;
    this.isListBeingEdited = false;
  }

  onDeleteAllLists() {
    this.#listService.getListsCount().subscribe((listsCount) => {
      if (listsCount > 0) {
        this.#dialogService
          .confirmationDialog({
            title: 'Delete All Lists',
            message:
              'The items associated with each list will not be deleted. ' +
              'Are you certain you want to delete all of your lists?',
            confirmCaption: 'Yes',
            cancelCaption: 'Cancel',
          })
          .subscribe((confirmed) => {
            if (confirmed) {
              this.#listService.deleteLists().subscribe({
                next: (deleteListServiceResponse) => {
                  this.#logger.debug(
                    'deleteLists() service response',
                    deleteListServiceResponse,
                  );
                  const deletedCount =
                    deleteListServiceResponse.listNames.length;
                  this.#snackBar.open(`Deleted ${deletedCount} Lists`, 'OK', {
                    duration: 2500,
                  });
                  this.#refreshTable();
                },
                error: (error) => {
                  this.#logger.error('', error);
                },
              });
            }
          });
      } else {
        this.#snackBar.open('No Lists to Delete', 'OK', {
          duration: 2500,
        });
      }
    });
  }

  onEditList(row: LrmList) {
    this.isListBeingCreated = false;
    this.isListBeingEdited = true;
    this.formListManage.patchValue(row);
    this.#currentRow = { ...row };
  }

  onTogglePublicList(row: LrmList) {
    const patchRequest: LrmListPatchRequest = {};
    patchRequest.public = !row.public;
    this.#submitPatchRequest(row.id, patchRequest);
  }

  onManageListContent() {
    // load another routable component with this functionality
    this.#noOp();
  }

  onDeleteList(row: LrmList) {
    this.#listService.deleteEmptyList(row.id).subscribe({
      next: () => this.#refreshTable(),
      error: (error) => {
        // http status 422 indicates the list could not be deleted due to existing item associations
        if (error.status == 422) {
          // confirm the user wants to remove the item associations
          this.#dialogService
            .confirmationDialog({
              title: 'Delete List',
              message: `${error.error.message}

                If the list is deleted its associated items will not be deleted.

                Proceed with deleting ${row.name}?`,
              confirmCaption: 'Yes',
              cancelCaption: 'Cancel',
            })
            .subscribe((confirmed) => {
              if (confirmed) {
                // delete the list and the item associations
                this.#listService
                  .deleteListAndItemAssociations(row.id)
                  .subscribe({
                    next: () => this.#refreshTable(),
                    error: (error) =>
                      this.#logger.error(
                        'deleteListAndItemAssociations() error: ',
                        error,
                      ),
                  });
              }
            });
        } else {
          this.#logger.error('deleteEmptyList() error: ', error);
          this.#snackBar.open('List not deleted due to an error.', 'OK', {
            duration: 2500,
          });
        }
      },
    });
  }

  // add/edit form buttons

  onCreateEditListSubmit(
    instanceFormListManage: FormGroupDirective,
    event: SubmitEvent,
  ) {
    if (!this.formListManage.valid) {
      this.#logger.debug('form is not valid');
      return;
    }

    this.isListBeingCreated
      ? this.#doListCreate(instanceFormListManage, event)
      : this.#doListEdit(instanceFormListManage);
  }

  onDismiss(instanceFormListManage: FormGroupDirective) {
    this.isListBeingCreated = false;
    this.isListBeingEdited = false;
    this.#doResetForm(instanceFormListManage);
  }

  // private functions

  #noOp() {
    this.#logger.debug('noOp()');
  }

  #doListCreate(
    instanceFormListManage: FormGroupDirective,
    event: SubmitEvent,
  ) {
    this.#saveCreatedListAndRefreshTable();

    if (event.submitter) {
      switch (event.submitter.id) {
        case 'save':
          this.onDismiss(instanceFormListManage);
          break;
        case 'saveAndCreateAnother':
          this.#doResetForm(instanceFormListManage);
          this.nameInput.nativeElement.focus();
          break;
        default:
          this.#logger.error(
            'unknown event submitter id: ',
            event.submitter.id,
          );
      }
    } else {
      this.#logger.error('event submitter is not a button.');
    }
  }

  #doListEdit(instanceFormListManage: FormGroupDirective) {
    this.#saveEditedListAndRefreshTable();
    this.onDismiss(instanceFormListManage);
  }

  #doResetForm(instanceFormListManage: FormGroupDirective) {
    instanceFormListManage.resetForm();
    this.formListManage.reset();
  }

  #saveCreatedListAndRefreshTable() {
    const postData: ListCreateRequest = {
      name: this.formListManage.getRawValue().name,
      description: coerceEmptyStringToNull(
        this.formListManage.getRawValue().description,
      ),
      public: this.formListManage.getRawValue().public,
    };

    this.#listService.postList(postData).subscribe({
      next: (postListServiceResponse) => {
        this.#logger.debug(postListServiceResponse);
        this.#snackBar.open(postListServiceResponse, 'OK', {
          duration: 6000,
        });
        this.#refreshTable();
      },
      error: () => {
        // this.#logger.debug('postList error', error);
      },
    });
  }

  #saveEditedListAndRefreshTable() {
    if (this.#currentRow != null) {
      const workingRow = this.#currentRow;
      const patchRequest = this.#buildPatchRequest(workingRow);
      if (JSON.stringify(patchRequest) !== '{}')
        this.#submitPatchRequest(workingRow.id, patchRequest);
      else {
        // TODO: handle empty patch request
        this.#logger.error('patchRequest is empty');
      }
      this.#currentRow = null;
    } else {
      this.#logger.error('#currentRow is unexpectedly null');
    }
  }

  #buildPatchRequest(workingRow: LrmList): LrmListPatchRequest {
    const patchRequest: LrmListPatchRequest = {};
    const { description, name, public: isPublic } = this.formListManage.value;

    // Check for description changes
    const newDescription = description?.trim() || '';
    if (
      (workingRow.description === undefined && newDescription) ||
      (workingRow.description !== undefined &&
        workingRow.description !== newDescription)
    ) {
      patchRequest.description = newDescription;
    }

    // Check for name changes
    const newName = name?.trim();
    if (newName && newName !== workingRow.name) {
      patchRequest.name = newName;
    }

    // Check for public status change
    if (isPublic !== workingRow.public) {
      patchRequest.public = isPublic;
    }

    return patchRequest;
  }

  #submitPatchRequest(id: string, patchRequest: LrmListPatchRequest) {
    this.#listService.patchList(id, patchRequest).subscribe({
      next: () => this.#refreshTable(),
      error: (error) => this.#logger.error('#submitPatchRequest()', error),
    });
  }

  #refreshTable() {
    // refresh dataSource with a new list of lists
    this.#listService.getLists().subscribe({
      next: (getListsServiceResponse) => {
        this.dataSource.data = getListsServiceResponse;
      },
      error: (error) => {
        this.#logger.error('', error);
      },
    });
  }

  #doLargerViewSettings() {
    if (this.paginator) {
      this.#setPageSize(10);
    } else {
      this.initalPaginatorPageSize = 10;
    }
    this.displayedColumns = [
      'name',
      'public',
      'description',
      'created',
      'updated',
      'actions',
    ];
  }

  #doSmallerViewSettings() {
    if (this.paginator) {
      this.#setPageSize(3);
    } else {
      this.initalPaginatorPageSize = 3;
    }
    this.displayedColumns = ['name', 'public', 'description', 'actions'];
  }

  #setPageSize(newSize: number) {
    this.#logger.debug('setPageSize()', newSize);
    // this.#logger.debug('currentPageSize:', this.paginator.pageSize);
    this.#logger.debug('currentPage:', this.paginator.pageIndex);
    let newPageIndex = 0;

    if (newSize > this.paginator.pageSize) {
      console.log(
        'switching to larger table page size: ' +
          this.paginator.pageSize +
          '->' +
          newSize,
      );
    } else {
      console.log(
        'switching to smaller table page size: ' +
          this.paginator.pageSize +
          '->' +
          newSize,
      );
      if (this.paginator.pageIndex > 0) {
        const rpage = this.paginator.pageIndex + 1;
        const npage = rpage * 2 - 2;
        newPageIndex = npage;
      }
    }

    const mp = this.dataSource.data.length / this.paginator.pageSize - 1;
    console.log(mp);
    console.log(Math.trunc(mp));
    this.#logger.debug(
      'max pageIndex:',
      this.dataSource.data.length / this.paginator.pageSize - 1,
    );

    this.paginator.pageSize = newSize;
    console.log(this.dataSource.data.length / newSize);
    this.paginator.pageIndex = newPageIndex;
    // Trigger a refresh of the table
    this.paginator.page.next({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.dataSource.data.length,
    });
    // this.paginator.firstPage()
  }
}
