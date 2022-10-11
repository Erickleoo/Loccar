import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditarLocadoraComponent } from './dialog-editar-locadora.component';

describe('DialogEditarLocadoraComponent', () => {
  let component: DialogEditarLocadoraComponent;
  let fixture: ComponentFixture<DialogEditarLocadoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditarLocadoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditarLocadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
