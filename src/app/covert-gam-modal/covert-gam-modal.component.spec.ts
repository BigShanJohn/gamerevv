import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovertGamModalComponent } from './covert-gam-modal.component';

describe('CovertGamModalComponent', () => {
  let component: CovertGamModalComponent;
  let fixture: ComponentFixture<CovertGamModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovertGamModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovertGamModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
