import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomButtons } from './custom-buttons';

describe('CustomButtons', () => {
  let component: CustomButtons;
  let fixture: ComponentFixture<CustomButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomButtons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomButtons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
