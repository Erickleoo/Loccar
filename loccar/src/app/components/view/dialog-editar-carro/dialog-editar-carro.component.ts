import { TipoCarros } from './../../../models/tipoCarros/tipo-carros.model';
import { Carros } from './../../../models/carros/carros.model';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Locadoras } from 'src/app/models/locadoras/locadoras.model';
import { CarrosService } from 'src/app/services/carros/carros.service';
import { LocadorasService } from 'src/app/services/locadoras/locadoras.service';

@Component({
  selector: 'app-dialog-editar-carro',
  templateUrl: './dialog-editar-carro.component.html',
  styleUrls: ['./dialog-editar-carro.component.css']
})
export class DialogEditarCarroComponent implements OnInit {

  public form!: FormGroup;
  locadoras: Locadoras[];
  tiposCarros: TipoCarros[];
  objTipo: any;

  constructor(
    public formBuilder: FormBuilder,
    private carrosService: CarrosService,
    private locadorasService: LocadorasService,
    public dialogRef: MatDialogRef<DialogEditarCarroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Carros,
  ) { }


  ngOnInit(): void {
    this.locadorasService.lerLocadoras().subscribe({
      next: (locadoras: Locadoras[]) => {
        this.locadoras = locadoras;
      },
      error: () => {
        console.error("Erro ao ler as locadoras!");
      }
    });

    this.carrosService.lerTipos().subscribe({
      next: (tiposCarros: TipoCarros[]) => {
        this.tiposCarros = tiposCarros;
      },
      error: () => {
        console.error("Erro ao ler as locadoras!");
      }
    });

    this.carrosService.lerCarros().subscribe({
      next: (carros: Carros[]) => {
      },
      error: () => {
        console.error("Erro ao ler as carros!");
      }
    });

    //valida se os campos estão selecionados
    this.form = this.formBuilder.group({
      carroID: new FormControl(''),
      nomeCarro: new FormControl('', [Validators.required]),
      listaTipo: new FormControl('', [Validators.required]),
      portas: new FormControl('', [Validators.required]),
      numeroPessoas: new FormControl('', [Validators.required]),
      selectLocadora: new FormControl('', [Validators.required]),

    });
    // this.form.controls['id'].setValue(this.data.id);
    this.form.controls['nomeCarro'].setValue(this.data.nome);
    this.form.controls["listaTipo"].setValue(this.data.tipoCarroId);
    this.form.controls["portas"].setValue(this.data.portas);
    this.form.controls["numeroPessoas"].setValue(this.data.npessoas);
    this.form.controls["selectLocadora"].setValue(this.data.locadoraId)
  }
  // Método para atualizar o carro
  UpdateCarros() {
    let carro: Carros = {
      id: this.data.id,
      nome: this.form.controls["nomeCarro"].value,
      tipoCarroId: this.form.controls["listaTipo"].value,
      portas: this.form.controls["portas"].value,
      npessoas: this.form.controls["numeroPessoas"].value,
      locadoraId: this.form.controls["selectLocadora"].value,
    };

    this.data.id = this.data.id;
    this.data.nome = this.form.controls["nomeCarro"].value;
    this.data.tipoCarroId = this.form.controls["listaTipo"].value;
    this.data.portas = this.form.controls["portas"].value;
    this.data.npessoas = this.form.controls["numeroPessoas"].value,
      this.data.locadoraId = this.form.controls["selectLocadora"].value
    this.dialogRef.close(this.data);

    this.form.reset();
  }

  //função para sair do dailog
  onNoClick(): void {
    this.dialogRef.close();
  }
}
