import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsTabs } from './maps-tabs';

describe('MapsTabs', () => {
  let component: MapsTabs;
  let fixture: ComponentFixture<MapsTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapsTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsTabs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
