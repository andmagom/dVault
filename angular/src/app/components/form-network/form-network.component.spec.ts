import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNetworkComponent } from './form-network.component';

describe('FormNetworkComponent', () => {
  let component: FormNetworkComponent;
  let fixture: ComponentFixture<FormNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormNetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
