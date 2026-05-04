import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupModalComponent } from './signup-modal.component';

describe('SignupModal', () => {
  let component: SignupModalComponent;
  let fixture: ComponentFixture<SignupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
