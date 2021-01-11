import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MythreadComponent } from './mythread.component';

describe('MythreadComponent', () => {
  let component: MythreadComponent;
  let fixture: ComponentFixture<MythreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MythreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MythreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
