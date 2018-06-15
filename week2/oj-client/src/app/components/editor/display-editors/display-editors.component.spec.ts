import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEditorsComponent } from './display-editors.component';

describe('DisplayEditorsComponent', () => {
  let component: DisplayEditorsComponent;
  let fixture: ComponentFixture<DisplayEditorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayEditorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayEditorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
