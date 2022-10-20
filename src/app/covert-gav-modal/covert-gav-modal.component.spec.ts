import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovertGavModalComponent } from './covert-gav-modal.component';

describe('CovertGavModalComponent', () => {
  let component: CovertGavModalComponent;
  let fixture: ComponentFixture<CovertGavModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovertGavModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovertGavModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
