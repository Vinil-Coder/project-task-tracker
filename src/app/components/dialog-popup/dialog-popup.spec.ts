import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPopup } from './dialog-popup';

describe('DialogPopup', () => {
  let component: DialogPopup;
  let fixture: ComponentFixture<DialogPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
