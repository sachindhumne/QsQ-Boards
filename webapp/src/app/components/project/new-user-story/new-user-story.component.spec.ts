import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserStoryComponent } from './new-user-story.component';

describe('NewUserStoryComponent', () => {
  let component: NewUserStoryComponent;
  let fixture: ComponentFixture<NewUserStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUserStoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
