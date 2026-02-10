import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputNotasComponent } from './input-notas.component';

describe('InputNotasComponent', () => {
  let component: InputNotasComponent;
  let fixture: ComponentFixture<InputNotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputNotasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
