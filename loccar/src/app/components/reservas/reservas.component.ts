import { LoadingService } from './../../services/loading/loading.service';
import { Carros } from './../../models/carros/carros.model';
import { Locadoras } from './../../models/locadoras/locadoras.model';
import { Reservas } from './../../models/reservas/reservas.model';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReservasService } from 'src/app/services/reservas/reservas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocadorasService } from 'src/app/services/locadoras/locadoras.service';
import { CarrosService } from 'src/app/services/carros/carros.service';
import { DialogExcluirComponent } from '../view/dialog-excluir/dialog-excluir.component';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { DialogEditarCarroComponent } from '../view/dialog-editar-carro/dialog-editar-carro.component';

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
  nomeUsuario: Boolean;
  idUsuario: number

  constructor(
    private formBuilder: FormBuilder,
    private reservasService: ReservasService,
    private locadorasService: LocadorasService,
    private carrosService: CarrosService,
    private usuario: UsuariosService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private loadingService: LoadingService,
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

    // Lê os carros, as locadoras e reservas no DB e salvar nas arryas respectivas
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

    // Verificar se o usuario é o ADM
    this.nomeUsuario = this.checkStatus();

    // função para registar qual usuario realizou o login
    this.idUsuario = this.usuario.obterUsuarioLogin().id;
  }

  // função para saber se é o ADM
  checkStatus() {
    if (this.usuario.obterUsuarioLogin().email === 'paulo@email.com') {
      return true
    } else return false
  }

  // atualiza os dados de reservas no DB com os valores colocados nos inputs
  atualizarReserva() {
    const id = this.reservas[this.id].id;
    console.log(id)
    const data = this.form.controls["data"].value;
    const horario = this.form.controls["horario"].value;
    const dataEntrega = this.form.controls["dataEntrega"].value
    const usuarioId = this.idUsuario;
    const carroId = this.form.controls["carroId"].value;

    const reserva: Reservas = { id: id, data: data, horario: horario, dataentrega: dataEntrega, usuarioId: usuarioId, carroId: carroId };
    console.log(reserva)

    this.reservasService.atualizarReservas(reserva).subscribe({
      next: () => {
        this.ngOnInit();
        this.alertaSnackBar("atualizado");
      },
      error: () => {
        console.error("Erro ao atualizar reserva!");
        this.alertaSnackBar("falha");
      }
    })
  }

  // função de cadastro
  cadastrarReservas() {

    // gera um id novo baseado no id mais alto do DB
    const id = (this.reservas[(this.reservas.length) - 1].id) + 1;

    // cria um novo carro com os valores dos inputs
    const data = this.form.controls["data"].value;
    const horario = this.form.controls["horario"].value;
    const dataEntrega = this.form.controls["dataEntrega"].value;
    const usuarioId = this.idUsuario;
    const carroId = this.form.controls["carroId"].value;
    const reservas: Reservas = { id: id, data: data, horario: horario, dataentrega: dataEntrega, usuarioId: usuarioId, carroId: carroId };

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

  // Pega os valores de carros no DB
  listarLocadoraCarro(carroId: any) {
    this.carrosService.pegarCarrosPeloID(carroId).subscribe({
      next: (carros) => {
        this.form.controls["filial"].setValue(carros.nome)
      },
      error: () => {
        console.error("Erro ao listar Locadoras!");
        this.alertaSnackBar("falha");
      }
    })
  }

  // Pega os valores da reserva e coloca nos inputs
  selecionarReserva(carros: Reservas) {
    this.form.controls["carroId"].setValue(carros.carroId)
    this.form.controls["data"].setValue(carros.data);
    this.form.controls["horario"].setValue(carros.horario);
    this.form.controls["dataEntrega"].setValue(carros.dataentrega);
    this.listarLocadoraCarro(carros.carroId);
    window.scroll(0, 0)

    console.log(carros)
  }

  // Abre o dialog de confirmação para excluir
  deletarReserva(id: number): void {
    let text;
    const dialogRef = this.dialog.open(DialogExcluirComponent, {
      width: '550px',
      data: text
    });

    // Depois de confirmar, exclui a reserva pelo id
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

  // função de alerta
  alertaSnackBar(tipoAlerta: string) {
    switch (tipoAlerta) {
      case "cadastrado":
        this.snackBar.open("Reserva cadastrada com sucesso.", undefined, {
          duration: 2000,
          panelClass: ['snackbar-sucess']
        });
        break;
      case "atualizado":
        this.snackBar.open("Reserva atualizada com sucesso.", undefined, {
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
