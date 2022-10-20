import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VrworldComponent } from './vrworld.component';

describe('VrworldComponent', () => {
  let component: VrworldComponent;
  let fixture: ComponentFixture<VrworldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VrworldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrworldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
