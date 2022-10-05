import { Reservas } from './../../models/reservas/reservas.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReservasService } from 'src/app/services/reservas/reservas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  form: FormGroup;
  error = "Este campo é obrigatório.";
  reservas: Reservas[];
  id: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private reservasService: ReservasService,
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

  }

  cadastrarReservas() {
    const id = (this.reservas[(this.reservas.length) - 1].id) + 1;
    const usuarioId = this.form.controls["usuarioID"].value;
    const nomeCarro = this.form.controls["nomeCarro"].value;
    const dataReserva = this.form.controls["dataReserva"].value;
    const horarioReserva = this.form.controls["horarioReserva"].value;
    const dataDevolucao = this.form.controls["dataDevolucao"].value;
    const reservas: Reservas = { id: id, data: dataReserva, horario: horarioReserva, dataentrega: dataDevolucao, usuarioId: usuarioId, carroNome: nomeCarro };

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
