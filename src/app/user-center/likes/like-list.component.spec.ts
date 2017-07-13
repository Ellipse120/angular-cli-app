import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LikeListComponent } from './like-list.component';

describe('LikeListComponent', () => {
  let component: LikeListComponent;
  let fixture: ComponentFixture<LikeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
