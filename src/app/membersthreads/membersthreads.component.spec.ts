import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersthreadsComponent } from './membersthreads.component';

describe('MembersthreadsComponent', () => {
  let component: MembersthreadsComponent;
  let fixture: ComponentFixture<MembersthreadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembersthreadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersthreadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
