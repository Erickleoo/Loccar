import { LoadingService } from './../../services/loading/loading.service';
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
import { DialogExcluirComponent } from '../view/dialog-excluir/dialog-excluir.component';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';

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
  adm: boolean = true;
  nomeUsuario:Boolean;
  idUsuario:number

  constructor(
    private formBuilder: FormBuilder,
    private reservasService: ReservasService,
    private locadorasService: LocadorasService,
    private carrosService: CarrosService,
    private usuario:UsuariosService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      usuarioId: new FormControl(''),
      data: new FormControl('', [Validators.required]),
      horario: new FormControl('', [Validators.required]),
      dataEntrega: new FormControl('', [Validators.required]),
      carroId: new FormControl('', [Validators.required]),
      filial: new FormControl('', [Validators.required]),
    });

    this.reservasService.lerReservas().subscribe({
      next: (reservas: Reservas[]) => {
        this.reservas = reservas;
        // console.log(reservas)
      },
      error: () => {
        console.error("Erro ao ler as reservas!");
        this.alertaSnackBar("falha");
      }
    });

    this.locadorasService.lerLocadoras().subscribe({
      next: (locadoras: Locadoras[]) => {
        this.locadoras = locadoras;
        // console.log(locadoras);
      },
      error: () => {
        console.error("Erro ao ler as locadoras!");
        this.alertaSnackBar("falha");
      }
    })

    this.carrosService.lerCarros().subscribe({
      next: (carros: Carros[]) => {
        this.carros = carros;
        // console.log(carros);
      },
      error: () => {
        console.error("Erro ao ler os carros!");
        this.alertaSnackBar("falha");
      }
    });
    this.nomeUsuario=this.checkStatus();
    this.idUsuario=this.usuario.obterUsuarioLogin().id

  }
  checkStatus(){
    if(this.usuario.obterUsuarioLogin().email==='paulo@email.com'){
      return true
    }else return false
  }
  cadastrarReservas() {
    const id = (this.reservas[(this.reservas.length) - 1].id) + 1;
    const data = this.form.controls["data"].value;
    const horario = this.form.controls["horario"].value;
    const dataEntrega = this.form.controls["dataEntrega"].value;
    const usuarioId = 1;
    // this.form.controls["usuarioId"].value;
    const carroId = this.form.controls["carroId"].value.id;
    const reservas: Reservas = { id: id, data: data, horario: horario, dataentrega: dataEntrega, usuarioId: usuarioId, carroId: carroId };
// console.log(reservas);

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

  deletarReserva(id: number): void {
    let text;
    const dialogRef = this.dialog.open(DialogExcluirComponent, {
      width: '550px',
      data: text
    });

    dialogRef.afterClosed().subscribe(boolean => {
      if (boolean) {
        this.loadingService.showLoading();
        this.reservasService.deletarReservas(id).subscribe({
          next: () => {
            this.ngOnInit();
            this.alertaSnackBar("deletado");
          },
          error: () => {
            console.error("Erro ao excluir reserva!");
            this.alertaSnackBar("falha")
          }
        })
      }
    })
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
