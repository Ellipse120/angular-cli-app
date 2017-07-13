import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentListByMeComponent } from './comment-list-by-me.component';

describe('CommentListByMeComponent', () => {
  let component: CommentListByMeComponent;
  let fixture: ComponentFixture<CommentListByMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentListByMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentListByMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
