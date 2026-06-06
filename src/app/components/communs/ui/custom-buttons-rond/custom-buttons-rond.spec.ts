import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomButtonsRond } from './custom-buttons-rond';

describe('CustomButtons', () => {
  let component: CustomButtonsRond;
  let fixture: ComponentFixture<CustomButtonsRond>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomButtonsRond]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomButtonsRond);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
