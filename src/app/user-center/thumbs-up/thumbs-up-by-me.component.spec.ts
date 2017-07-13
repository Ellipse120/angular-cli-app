import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbsUpByMeComponent } from './thumbs-up-by-me.component';

describe('ThumbsUpByMeComponent', () => {
  let component: ThumbsUpByMeComponent;
  let fixture: ComponentFixture<ThumbsUpByMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbsUpByMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbsUpByMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
