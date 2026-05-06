import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsButtons } from './maps-buttons';

describe('MapsButtons', () => {
  let component: MapsButtons;
  let fixture: ComponentFixture<MapsButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapsButtons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsButtons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
