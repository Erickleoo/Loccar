import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Carros } from 'src/app/models/carros/carros.model';
import { Locadoras } from 'src/app/models/locadoras/locadoras.model';
import { TipoCarros } from 'src/app/models/tipoCarros/tipo-carros.model';
import { CarrosService } from 'src/app/services/carros/carros.service';
import { LocadorasService } from 'src/app/services/locadoras/locadoras.service';
import { DialogEditarCarroComponent } from '../dialog-editar-carro/dialog-editar-carro.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-carros',
  templateUrl: './modal-carros.component.html',
  styleUrls: ['./modal-carros.component.css']
})
export class ModalCarrosComponent implements OnInit {

  form!: FormGroup;
  locadoras: Locadoras[];
  tiposCarros: TipoCarros[];
  carros: Carros[];

  constructor(
    public formBuilder: FormBuilder,
    private carrosService: CarrosService,
    private route: Router,
    private locadorasService: LocadorasService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogEditarCarroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Carros,
  ) { }

  ngOnInit(): void {

    //Valida se os campos estão selecionados ok
    this.form = this.formBuilder.group({
      carroID: new FormControl(''),
      nomeCarro: new FormControl('', [Validators.required]),
      listaTipo: new FormControl('', [Validators.required]),
      portas: new FormControl('', [Validators.required]),
      numeroPessoas: new FormControl('', [Validators.required]),
      selectLocadora: new FormControl('', [Validators.required]),
    });

    //ok
    this.locadorasService.lerLocadoras().subscribe({
      next: (locadoras: Locadoras[]) => {
        this.locadoras = locadoras;
      },
      error: () => {
        console.error("Erro ao ler as locadoras!");
      }
    });

    //ok
    this.carrosService.lerTipos().subscribe({
      next: (tiposCarros: TipoCarros[]) => {
        this.tiposCarros = tiposCarros;
      },
      error: () => {
        console.error("Erro ao ler as locadoras!");
      }
    });

    //ok
    this.carrosService.lerCarros().subscribe({
      next: (carros: Carros[]) => {
        this.carros = carros
      },
      error: () => {
        console.error("Erro ao ler as carros!");
      }
    });

    //valida se os campos estão selecionados

    // this.form.controls['id'].setValue(this.data.id);
    this.form.controls['nomeCarro'].setValue(this.data.nome);
    this.form.controls["listaTipo"].setValue(this.data.tipoCarroId);
    this.form.controls["portas"].setValue(this.data.portas);
    this.form.controls["numeroPessoas"].setValue(this.data.npessoas);
    this.form.controls["selectLocadora"].setValue(this.data.locadoraId)
  }

  reservar() {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
