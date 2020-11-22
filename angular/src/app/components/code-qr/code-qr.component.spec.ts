import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeQRComponent } from './code-qr.component';

describe('CodeQRComponent', () => {
  let component: CodeQRComponent;
  let fixture: ComponentFixture<CodeQRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeQRComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
