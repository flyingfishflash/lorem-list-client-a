import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListManageContentComponent } from './list-manage-content.component';

describe('ListManageContentComponent', () => {
  let component: ListManageContentComponent;
  let fixture: ComponentFixture<ListManageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListManageContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListManageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
