import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSecretComponent } from './form-secret.component';

describe('FormSecretComponent', () => {
  let component: FormSecretComponent;
  let fixture: ComponentFixture<FormSecretComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormSecretComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSecretComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
