import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCarrosComponent } from './modal-carros.component';

describe('ModalCarrosComponent', () => {
  let component: ModalCarrosComponent;
  let fixture: ComponentFixture<ModalCarrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalCarrosComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModalCarrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
