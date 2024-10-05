// import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import {
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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { coerceEmptyStringToNull } from '../../../core/shared/coerce-empty-string-to-null.function';
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

  dataSource = new MatTableDataSource<LrmList>();
  dataSource$: Observable<MatTableDataSource<LrmList>>;
  destroyed$ = new Subject<void>();
  displayedColumns: string[] = [];
  initalPaginatorPageSize: number = 0;
  isSmallerView: boolean | undefined;
  isListBeingEdited = false;
  isListBeingAdded = false;

  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #listService = inject(ListsService);
  readonly #logger = new Logger('list-manage.component');

  #currentRow: LrmList | null = null;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editListForm = this.#formBuilder.group(
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
        Breakpoints.Medium,
        Breakpoints.Handset,
        Breakpoints.Tablet,
      ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result) => {
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
    this.isListBeingAdded = true;
    this.isListBeingEdited = false;
  }

  onEditList(row: LrmList) {
    this.isListBeingAdded = false;
    this.isListBeingEdited = true;
    this.editListForm.patchValue(row);
    this.#currentRow = { ...row };
  }

  onTogglePublicList(row: LrmList) {
    const patchRequest: LrmListPatchRequest = {};
    patchRequest.public = !row.public;
    this.#submitPatchRequest(row.id, patchRequest);
  }

  onDeleteList(row: LrmList) {
    // TODO capture warning that items are associated with the list, ask for permission to remove those associations
    this.#listService.deleteList(row.id, false).subscribe({
      next: (deleteListServiceResponse) => {
        this.#logger.debug(
          'deleteLists() service response',
          deleteListServiceResponse,
        );
        // refresh dataSource with a new list of lists
        this.#listService.getLists().subscribe({
          next: (getListsServiceResponse) => {
            this.#logger.debug(
              'getLists() service response',
              getListsServiceResponse,
            );
            this.dataSource.data = getListsServiceResponse;
          },
          error: (error) => {
            this.#logger.error('', error);
          },
        });
      },
      error: (error) => {
        this.#logger.error('', error);
      },
    });
  }

  // add/edit form buttons

  onCreateEditListSubmit() {
    if (this.editListForm.valid) {
      if (this.isListBeingAdded) {
        this.#saveCreatedListAndRefreshTable();
      } else {
        this.#saveEditedListAndRefreshTable();
      }
    }
  }

  onDismiss(formDirective: { resetForm: () => void }) {
    this.isListBeingAdded = false;
    this.isListBeingEdited = false;
    formDirective.resetForm();
    this.editListForm.reset();
  }

  noOp() {
    this.#logger.debug('noOp()');
  }

  #saveCreatedListAndRefreshTable() {
    const postData: ListCreateRequest = {
      name: this.editListForm.getRawValue().name,
      description: coerceEmptyStringToNull(
        this.editListForm.getRawValue().description,
      ),
      public: this.editListForm.getRawValue().public,
    };

    this.#listService.postList(postData).subscribe({
      next: (serviceResponse) => {
        this.#logger.debug(serviceResponse);
        // const dialogRef = this.#dialog.open(DialogGeneralComponent, {
        //   data: {
        //     title: 'List Created',
        //     message: serviceResponse,
        //   },
        // });
        // dialogRef.afterClosed().subscribe(() => {
        //   formDirective.resetForm();
        //   this.createListForm.reset();
        // });
      },
      error: () => {
        // this.#logger.debug('', error);
      },
    });
  }

  #saveEditedListAndRefreshTable() {
    if (this.#currentRow != null) {
      const workingRow = this.#currentRow;
      const patchRequest = this.#buildPatchRequest(workingRow);
      if (JSON.stringify(patchRequest) !== '{}')
        this.#submitPatchRequest(workingRow.id, patchRequest);
      else this.#logger.error('patchRequest is empty');
      this.isListBeingEdited = false;
      this.editListForm.reset();
      this.#currentRow = null;
    } else {
      this.#logger.error('#currentRow is unexpectedly null');
    }
  }

  #buildPatchRequest(workingRow: LrmList): LrmListPatchRequest {
    const patchRequest: LrmListPatchRequest = {};
    const { description, name, public: isPublic } = this.editListForm.value;

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
      next: (patchListserviceResponse) => {
        this.#logger.debug(
          'patchLists() service response',
          patchListserviceResponse,
        );
        // refresh dataSource with a new list of lists
        this.#listService.getLists().subscribe({
          next: (getListsServiceResponse) => {
            this.#logger.debug(
              'getLists() service response',
              getListsServiceResponse,
            );
            this.dataSource.data = getListsServiceResponse;
          },
          error: (error) => {
            this.#logger.error('', error);
          },
        });
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
