import { Locadoras } from './../../../models/locadoras/locadoras.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocadorasService } from 'src/app/services/locadoras/locadoras.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-editar-locadora',
  templateUrl: './dialog-editar-locadora.component.html',
  styleUrls: ['./dialog-editar-locadora.component.css']
})
export class DialogEditarLocadoraComponent implements OnInit {

  public formLocadora!: FormGroup;
  locadoras: Locadoras[];

  constructor(
    public FormBuilder: FormBuilder,
    private LocadorasService: LocadorasService,
    public dialogRef: MatDialogRef<DialogEditarLocadoraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Locadoras,
  ) { }

  ngOnInit() {
    this.LocadorasService.lerLocadoras().subscribe({
      next: (locadoras: Locadoras[]) => {
        this.locadoras = locadoras;
      },
      error: () => {
        console.error("Erro ao ler as locadoras!");
      }
    });

    // Valida se os campos estão selecionados
    this.formLocadora = this.FormBuilder.group({
      locadora: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required]),
      tel: new FormControl('', [Validators.required]),
    });

    // this.form.controls['id'].setValue(this.data.id);
    this.formLocadora.controls['locadora'].setValue(this.data.nome);
    this.formLocadora.controls['end'].setValue(this.data.endereco);
    this.formLocadora.controls['tel'].setValue(this.data.telefone);
  }

  // Método para atualizar o carro
  UpdateLocadora() {
    let locadora: Locadoras = {
      id: this.data.id,
      nome: this.formLocadora.controls["locadora"].value,
      endereco: this.formLocadora.controls["end"].value,
      telefone: this.formLocadora.controls["tel"].value,
    };

    this.data.id = this.data.id;
    this.data.nome = this.formLocadora.controls['locadora'].value;
    this.data.endereco = this.formLocadora.controls['end'].value;
    this.data.telefone = this.formLocadora.controls['tel'].value;
    this.dialogRef.close(this.data);

    this.formLocadora.reset();
  }

  // Função para sair do dialog
  onNoClick(): void {
    this.dialogRef.close();
  }
}
