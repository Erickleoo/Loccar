import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditarCarroComponent } from './dialog-editar-carro.component';

describe('DialogEditarCarroComponent', () => {
  let component: DialogEditarCarroComponent;
  let fixture: ComponentFixture<DialogEditarCarroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditarCarroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditarCarroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
