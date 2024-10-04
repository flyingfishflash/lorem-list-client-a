import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsManageComponent } from './lists-manage.component';

describe('ListsManageComponent', () => {
  let component: ListsManageComponent;
  let fixture: ComponentFixture<ListsManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListsManageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
