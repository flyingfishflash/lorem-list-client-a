import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
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
import { ItemCreateRequest } from '../../model/item-create-request';
import { LrmListItem } from '../../model/lrm-list-item';
import { LrmListItemPatchRequest } from '../../model/lrm-list-item-patch-request';
import { LrmListPatchRequest } from '../../model/lrm-list-patch-request';
import { ListItemsService } from '../../services/api/list-items.service';
import { ListsService } from '../../services/api/lists.service';
import { MatTableResponsiveDirective } from './mat-table-responsive.directive';

@Component({
  selector: 'app-list-manage-content',
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
  templateUrl: './list-manage-content.component.html',
  styleUrl: './list-manage-content.component.scss',
})
export class ListManageContentComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('nameInput') nameInput!: ElementRef;

  dataSource = new MatTableDataSource<LrmListItem>();
  dataSource$: Observable<MatTableDataSource<LrmListItem>> | undefined;
  destroyed$ = new Subject<void>();
  displayedColumns: string[] = [];
  initalPaginatorPageSize: number = 0;
  isSmallerView: boolean | undefined;
  isListItemBeingEdited = false;
  isListItemBeingCreated = false;
  isSaveandCreateAnother = false;
  listId = input.required<string>();
  listName: string = '';

  readonly #dialogService = inject(DialogService);
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #listService = inject(ListsService);
  readonly #listItemService = inject(ListItemsService);
  readonly #logger = new Logger('list-manage-content.component');
  readonly #snackBar = inject(MatSnackBar);

  #currentRow: LrmListItem | null = null;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  formListItemManage = this.#formBuilder.group(
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
      quantity: [0, [Validators.min(0), Validators.max(10000)]],
      isSuppressed: [false],
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
  }

  ngOnInit(): void {
    const emptyLrmListItem: LrmListItem[] = [
      {
        id: '',
        name: '',
        description: '',
        quantity: 0,
        isSuppressed: false,
        created: '',
        createdBy: '',
        updated: '',
        updatedBy: '',
        lists: [],
      },
    ];

    this.dataSource$ = this.#listService
      .getListIncludeItems(this.listId())
      .pipe(
        map((serviceResponse) => {
          // initialize dataSource as empty and set sort/pagination
          this.dataSource = new MatTableDataSource<LrmListItem>(
            emptyLrmListItem,
          );
          this.listName = serviceResponse.name;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          console.log(this.initalPaginatorPageSize);
          this.dataSource.paginator.pageSize = this.initalPaginatorPageSize;
          this.dataSource.data = serviceResponse.items;
          return this.dataSource;
        }),
      );
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onCreateListItem() {
    this.isListItemBeingCreated = true;
    this.isListItemBeingEdited = false;
  }

  onRemoveAllListItems() {
    if (this.dataSource.data.length > 0) {
      this.#dialogService
        .confirmationDialog({
          title: 'Remove All List Items',
          message:
            'The items associated with each list will be removed from the list, not deleted. ' +
            'Are you certain you want to clear all items from this list?',
          confirmCaption: 'Yes',
          cancelCaption: 'Cancel',
        })
        .subscribe((confirmed) => {
          if (confirmed) {
            this.#listItemService.deleteItems(this.listId()).subscribe({
              next: (deleteItemsServiceResponse) => {
                this.#logger.debug(
                  'deleteitems() service response',
                  deleteItemsServiceResponse,
                );
                this.#snackBar.open(
                  `${deleteItemsServiceResponse.message}`,
                  'OK',
                  {
                    duration: 2500,
                  },
                );
                this.#refreshTable();
              },
              error: (error) => {
                this.#logger.error('', error);
              },
            });
          }
        });
    } else {
      this.#snackBar.open('No Items to Remove', 'OK', {
        duration: 2500,
      });
    }
  }

  onFilterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEditListItem(row: LrmListItem) {
    this.isListItemBeingCreated = false;
    this.isListItemBeingEdited = true;
    this.formListItemManage.patchValue(row);
    this.#currentRow = { ...row };
  }

  onToggleItemSuppression(row: LrmListItem) {
    this.#logger.debug('onToggleSuppression()', row);
    const patchRequest: LrmListItemPatchRequest = {
      isSuppressed: !row.isSuppressed,
    };
    this.#submitPatchRequest(this.listId(), row.id, patchRequest);
  }

  onManageListContent() {
    // load another routable component with this functionality
    this.#noOp();
  }

  onRemoveListItem(row: LrmListItem) {
    this.#listItemService.deleteItem(this.listId(), row.id).subscribe({
      next: () => this.#refreshTable(),
      error: (error) => {
        // http status 422 indicates the list could not be deleted due to existing item associations
        // if (error.status == 422) {
        //   // confirm the user wants to remove the item associations
        //   this.#dialogService
        //     .confirmationDialog({
        //       title: 'Remove Item',
        //       message: `${error.error.message}

        //         Item will be remove the list.

        //         Proceed with removing the item ${row.name}?`,
        //       confirmCaption: 'Yes',
        //       cancelCaption: 'Cancel',
        //     })
        //     .subscribe((confirmed) => {
        //       if (confirmed) {
        //         // delete the list and the item associations
        //         this.#listService
        //           .deleteListAndItemAssociations(row.id)
        //           .subscribe({
        //             next: () => this.#refreshTable(),
        //             error: (error) =>
        //               this.#logger.error(
        //                 'deleteListAndItemAssociations() error: ',
        //                 error,
        //               ),
        //           });
        //       }
        //     });
        // } else {
        this.#logger.error('deleteEmptyList() error: ', error);
        this.#snackBar.open('List not deleted due to an error.', 'OK', {
          duration: 2500,
        });
        // }
      },
    });
  }

  // add/edit form buttons

  onCreateEditListSubmit(
    instanceFormListManage: FormGroupDirective,
    event: SubmitEvent,
  ) {
    if (!this.formListItemManage.valid) {
      this.#logger.debug('form is not valid');
      Object.keys(this.formListItemManage.controls).forEach((key) => {
        const controlErrors = this.formListItemManage.get(key)?.errors;
        if (controlErrors) {
          console.log(`Validation errors for ${key}:`, controlErrors);
        }
      });
      return;
    }

    this.isListItemBeingCreated
      ? this.#doListCreate(instanceFormListManage, event)
      : this.#doListEdit(instanceFormListManage);
  }

  onDismiss(instanceFormListManage: FormGroupDirective) {
    this.isListItemBeingCreated = false;
    this.isListItemBeingEdited = false;
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
    this.#saveCreatedItemAndRefreshTable();

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
    this.formListItemManage.reset();
  }

  #saveCreatedItemAndRefreshTable() {
    this.#logger.debug('saveCreatedItemAndRefreshTable()');
    const postData: ItemCreateRequest = {
      name: this.formListItemManage.getRawValue().name,
      description: coerceEmptyStringToNull(
        this.formListItemManage.getRawValue().description,
      ),
      quantity: this.formListItemManage.getRawValue().quantity,
      isSuppressed: false,
    };

    this.#listItemService.postItem(this.listId(), postData).subscribe({
      next: (postListItemServiceResponse) => {
        this.#logger.debug(postListItemServiceResponse);
        this.#snackBar.open(postListItemServiceResponse, 'OK', {
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
        this.#submitPatchRequest(this.listId(), workingRow.id, patchRequest);
      else {
        // TODO: handle empty patch request
        this.#logger.error('patchRequest is empty');
      }
      this.#currentRow = null;
    } else {
      this.#logger.error('#currentRow is unexpectedly null');
    }
  }

  #buildPatchRequest(workingRow: LrmListItem): LrmListPatchRequest {
    const patchRequest: LrmListItemPatchRequest = {};
    const { description = '', name, quantity } = this.formListItemManage.value;

    const newDescription = description.trim();
    const newName = name?.trim();

    if (newDescription !== (workingRow.description ?? '')) {
      patchRequest.description = newDescription;
    }

    if (newName && newName !== workingRow.name) {
      patchRequest.name = newName;
    }

    if (quantity !== undefined && quantity !== workingRow.quantity) {
      patchRequest.quantity = quantity;
    }

    return patchRequest;
  }

  #submitPatchRequest(
    listId: string,
    itemId: string,
    patchRequest: LrmListPatchRequest,
  ) {
    this.#listItemService
      .patchListItem(listId, itemId, patchRequest)
      .subscribe({
        next: () => this.#refreshTable(),
        error: (error) => this.#logger.error('#submitPatchRequest()', error),
      });
  }

  #refreshTable() {
    // refresh dataSource with a new list of lists
    this.#listService.getListIncludeItems(this.listId()).subscribe({
      next: (getListsServiceResponse) => {
        this.dataSource.data = getListsServiceResponse.items;
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
      'description',
      'quantity',
      'suppressed',
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
    this.displayedColumns = [
      'name',
      'description',
      'quantity',
      'suppressed',
      'actions',
    ];
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
