import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGeneralComponent } from './dialog-general.component';

describe('DialogGeneralComponent', () => {
  let component: DialogGeneralComponent;
  let fixture: ComponentFixture<DialogGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogGeneralComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
