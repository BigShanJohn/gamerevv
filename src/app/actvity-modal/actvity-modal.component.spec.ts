import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActvityModalComponent } from './actvity-modal.component';

describe('ActvityModalComponent', () => {
  let component: ActvityModalComponent;
  let fixture: ComponentFixture<ActvityModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActvityModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActvityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
