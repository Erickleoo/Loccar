import { Router } from '@angular/router';
import { UsuariosService } from './../../services/usuarios/usuarios.service';
import { Carros } from './../../models/carros/carros.model';
import { LocadorasService } from './../../services/locadoras/locadoras.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarrosService } from 'src/app/services/carros/carros.service';
import { Locadoras } from 'src/app/models/locadoras/locadoras.model';
import { TipoCarros } from 'src/app/models/tipoCarros/tipo-carros.model';
import { DialogEditarCarroComponent } from '../view/dialog-editar-carro/dialog-editar-carro.component';
import { DialogExcluirComponent } from '../view/dialog-excluir/dialog-excluir.component';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ModalCarrosComponent } from '../view/modal-carros/modal-carros.component';

@Component({
  selector: 'app-carros',
  templateUrl: './carros.component.html',
  styleUrls: ['./carros.component.css'],
})
export class CarrosComponent implements OnInit {

  form: FormGroup;
  error = "Este campo é obrigatório.";
  carros: Carros[];
  locadoras: Locadoras[];
  tiposCarros: TipoCarros[];
  id: number = 0;
  nomeUsuario: Boolean
  storage: Storage


  constructor(
    private formBuilder: FormBuilder,
    private carrosService: CarrosService,
    private locadorasService: LocadorasService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.storage = window.localStorage;
  }


  ngOnInit(): void {
    this.form = this.formBuilder.group({

      carroID: new FormControl(''),
      nomeCarro: new FormControl('', [Validators.required]),
      listaTipo: new FormControl('', [Validators.required]),
      portas: new FormControl('', [Validators.required]),
      numeroPessoas: new FormControl('', [Validators.required]),
      selectLocadora: new FormControl('', [Validators.required]),

    });

    this.carrosService.lerCarros().subscribe({
      next: (carros: Carros[]) => {
        this.carros = carros;
      },
      error: () => {
        console.error("Erro ao ler as carros!");
        this.alertaSnackBar("falha");
      }
    });

    this.locadorasService.lerLocadoras().subscribe({
      next: (locadoras: Locadoras[]) => {
        this.locadoras = locadoras;
      },
      error: () => {
        console.error("Erro ao ler as locadoras!");
        this.alertaSnackBar("falha");
      }
    });

    this.carrosService.lerTipos().subscribe({
      next: (tiposCarros: TipoCarros[]) => {
        this.tiposCarros = tiposCarros;
      },
      error: () => {
        console.error("Erro ao ler as locadoras!");
        this.alertaSnackBar("falha");
      }
    });

    this.carrosService.lerCarros().subscribe({
      next: (carros: Carros[]) => {
        this.carros = carros;
      },
      error: () => {
        console.error("Erro ao ler as carros!");
        this.alertaSnackBar("falha");
      }

    });

    this.nomeUsuario = this.checkStatus();

  }

  checkStatus() {
    if (JSON.parse(this.storage.getItem('key') || '{}') === 'paulo@email.com') {
      return true
    } else return false
  }

  cadastrarCarros() {
    const id = (this.carros[(this.carros.length) - 1].id) + 1;
    const nomeCarro = this.form.controls["nomeCarro"].value;
    const listaTipo = this.form.controls["listaTipo"].value.id;
    const portas = this.form.controls["portas"].value;
    const numeroPessoas = this.form.controls["numeroPessoas"].value;
    const selectLocadora = this.form.controls["selectLocadora"].value.id;
    const carros: Carros = { id: id, nome: nomeCarro, portas: portas, npessoas: numeroPessoas, locadoraId: selectLocadora, tipoCarroId: listaTipo };

    this.carrosService.salvarCarros(carros).subscribe({
      next: () => {
        this.ngOnInit();
        this.alertaSnackBar("cadastrado");
      },
      error: () => {
        console.error("Erro ao cadastrar carro!");
        this.alertaSnackBar("falha");
      }
    });
  }

  deletarCarro(id: number): void {
    let text;
    const dialogRef = this.dialog.open(DialogExcluirComponent, {
      width: '550px',
      data: text
    });

    dialogRef.afterClosed().subscribe(boolean => {
      if (boolean) {
        this.loadingService.showLoading();
        this.carrosService.deletarCarros(id).subscribe({
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

  openDialogDetalhes(element: Carros): void {
    let enterAnimationDuration = '500ms';
    let exitAnimationDuration = '500ms';

    const dialogRef = this.dialog.open(ModalCarrosComponent, {
      height: '100%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: element
    })
    dialogRef.afterClosed().subscribe(ifTrue => {
      if (ifTrue) {
        this.carrosService.salvarCarroSelecionadoId(element.id)
        this.router.navigate(["/reservas"])
      }
    })
  }

  //função para enviar os dados para o dialog que abre no botão editar
  openDialog(
    id: number,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {

    this.carrosService.pegarCarrosPeloID(id).subscribe({
      next: (carros: Carros) => {
        const dialogRef = this.dialog.open(DialogEditarCarroComponent, {
          width: '80%',
          height: '50%',
          enterAnimationDuration,
          exitAnimationDuration,
          data: {
            id: carros.id,
            nome: carros.nome,
            portas: carros.portas,
            npessoas: carros.npessoas,
            locadoraId: carros.locadoraId,
            tipoCarroId: carros.tipoCarroId,

          },

        });

        dialogRef.afterClosed().subscribe((carros) => {
          if (carros) {
            this.carrosService.atualizarCarros(carros).subscribe({
              next: () => {
                this.ngOnInit();
                this.alertaSnackBar('alteracaoSalva');
              },
              error: () => {
                this.alertaSnackBar('erroEditar');
              },
            });
          }
        });
      },
      error: () => {
        this.alertaSnackBar('erroEditar');
      },
    });
  }

  alertaSnackBar(tipoAlerta: string) {
    switch (tipoAlerta) {
      case "cadastrado":
        this.snackBar.open("Carro cadastrado com sucesso.", undefined, {
          duration: 2000,
          panelClass: ['snackbar-sucess']
        });
        break;
      case "alteracaoSalva":
        this.snackBar.open("Alterações salvas com sucesso.", undefined, {
          duration: 2000,
          panelClass: ['snackbar-sucess']
        });
        break;
      case "deletado":
        this.snackBar.open("Carro deletado com sucesso.", undefined, {
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
