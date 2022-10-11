import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExcluirComponent } from './dialog-excluir.component';

describe('DialogExcluirComponent', () => {
  let component: DialogExcluirComponent;
  let fixture: ComponentFixture<DialogExcluirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogExcluirComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogExcluirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
