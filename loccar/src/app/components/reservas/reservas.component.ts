import { Carros } from './../../models/carros/carros.model';
import { Locadoras } from './../../models/locadoras/locadoras.model';
import { Reservas } from './../../models/reservas/reservas.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReservasService } from 'src/app/services/reservas/reservas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LocadorasService } from 'src/app/services/locadoras/locadoras.service';
import { CarrosService } from 'src/app/services/carros/carros.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  form: FormGroup;
  error = "Este campo é obrigatório.";
  reservas: Reservas[];
  locadoras: Locadoras[];
  carros: Carros[];
  id: number = 0;
  adm: boolean = true

  constructor(
    private formBuilder: FormBuilder,
    private reservasService: ReservasService,
    private locadorasService: LocadorasService,
    private carrosService: CarrosService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      usuarioID: new FormControl(''),
      nomeCarro: new FormControl('', [Validators.required]),
      dataReserva: new FormControl('', [Validators.required]),
      horarioReserva: new FormControl('', [Validators.required]),
      dataDevolucao: new FormControl('', [Validators.required]),
      filial: new FormControl('', [Validators.required]),
    });

    this.reservasService.lerReservas().subscribe({
      next: (reservas: Reservas[]) => {
        this.reservas = reservas;
        console.log(reservas)
      },
      error: () => {
        console.error("Erro ao ler as reservas!");
        this.alertaSnackBar("falha");
      }
    });

    this.locadorasService.lerLocadoras().subscribe({
      next: (locadoras: Locadoras[]) => {
        this.locadoras = locadoras;
        console.log(locadoras);
      },
      error: () => {
        console.error("Erro ao ler as locadoras!");
        this.alertaSnackBar("falha");
      }
    });

    this.carrosService.lerCarros().subscribe({
      next: (carros: Carros[]) => {
        this.carros = carros;
        console.log(carros);
      },
      error: () => {
        console.error("Erro ao ler os carros!");
        this.alertaSnackBar("falha");
      }
    });
  }

  cadastrarReservas() {
    const id = (this.reservas[(this.reservas.length) - 1].id) + 1;
    const usuarioId = this.form.controls["usuarioID"].value;
    const nomeCarro = this.form.controls["nomeCarro"].value;
    const dataReserva = this.form.controls["dataReserva"].value;
    const horarioReserva = this.form.controls["horarioReserva"].value;
    const dataDevolucao = this.form.controls["dataDevolucao"].value;
    const reservas: Reservas = { id: id, data: dataReserva, horario: horarioReserva, dataentrega: dataDevolucao, usuarioId: usuarioId, carroID: nomeCarro };

    this.reservasService.salvarReservas(reservas).subscribe({
      next: () => {
        this.ngOnInit();
        this.alertaSnackBar("cadastrado");
      },
      error: () => {
        console.error("Erro ao cadastrar reserva!");
        this.alertaSnackBar("falha");
      }
    });
  }

  deletarReserva(reserva_id: number) {
    this.reservasService.deletarReservas(reserva_id).subscribe({
      next: () => {
        this.ngOnInit();
        this.alertaSnackBar("deletado");
      },
      error: () => {
        console.error("Erro ao deletar a reserva");
        this.alertaSnackBar("falha");
      }
    });
  }

  alertaSnackBar(tipoAlerta: string) {
    switch (tipoAlerta) {
      case "cadastrado":
        this.snackBar.open("Reserva cadastrada com sucesso.", undefined, {
          duration: 2000,
          panelClass: ['snackbar-sucess']
        });
        break;
      case "deletado":
        this.snackBar.open("Reserva deletada com sucesso.", undefined, {
          duration: 2000,
          panelClass: ['snackbar-sucess']
        });
        break;
      case "falha":
        this.snackBar.open("Serviço indisponível no momento, tente novamente mais tarde.", undefined, {
          duration: 2000,
          panelClass: ['snackbar-falha']
        });
        break;
    }
  }

}
