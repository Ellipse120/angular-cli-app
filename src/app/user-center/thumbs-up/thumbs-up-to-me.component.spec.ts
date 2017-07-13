import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbsUpToMeComponent } from './thumbs-up-to-me.component';

describe('ThumbsUpToMeComponent', () => {
  let component: ThumbsUpToMeComponent;
  let fixture: ComponentFixture<ThumbsUpToMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbsUpToMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbsUpToMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
