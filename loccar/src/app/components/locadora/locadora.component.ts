import { DialogEditarLocadoraComponent } from './../view/dialog-editar-locadora/dialog-editar-locadora.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Locadoras } from 'src/app/models/locadoras/locadoras.model';
import { LocadorasService } from 'src/app/services/locadoras/locadoras.service';
import { DialogExcluirComponent } from '../view/dialog-excluir/dialog-excluir.component';

@Component({
  selector: 'app-locadora',
  templateUrl: './locadora.component.html',
  styleUrls: ['./locadora.component.css']
})
export class LocadoraComponent implements OnInit {
  formLocadora: FormGroup;
  error = "Este campo é obrigatório";
  id: number = 0;
  locadoras: Locadoras[];
  adm: boolean = true

  constructor(
    private formBuilder: FormBuilder,
    private locadorasService: LocadorasService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    // Ler as locadoras no DB e salvar na array "Locadoras"
    this.locadorasService.lerLocadoras().subscribe({
      next: (locadora: Locadoras[]) => {
        this.locadoras = locadora;
        console.log(locadora);
      },
      error: () => {
        console.log("Erro ao ler a locadora.");
        this.alertaSnackBar("falha");
      }
    })

    this.formLocadora = this.formBuilder.group({
      locadora: new FormControl('', [Validators.required]),
      endereço: new FormControl('', [Validators.required]),
      telefone: new FormControl('', [Validators.required]),
    })
  }

  // editarLocadora(locadora: Locadoras){
  //   this.id = locadora.id;
  //   const EditLocadora = this.formLocadora.controls['locadora'].setValue(locadora.nome);
  //   const EditEndereço = this.formLocadora.controls['endereço'].setValue(locadora.endereco);
  //   const EditTel = this.formLocadora.controls['telefone'].setValue(locadora.telefone);
  //   window.scroll(0,0)
  // }

  // abre o dialog de confirmação para excluir
  excluirLocadora(id: number): void {
    let text;
    const dialogRef = this.dialog.open(DialogExcluirComponent, {
      width: '550px',
      data: text
    });

    // depois da confirmação, exclui a locadora pelo id
    dialogRef.afterClosed().subscribe(boolean =>{
      if (boolean) {
        this.locadorasService.excluirLocadora(id).subscribe({
          next: () => {
            this.ngOnInit()
            this.alertaSnackBar("excluída");
          },
          error: () => {
            console.log("Erro ao tentar excluir.");
            this.alertaSnackBar("falha");
          }
        })
      }
    })
  }

  // atualiza os dados do usuario no DB com os valores colocados nos inputs
  updateLocadora(){
    const id = this.id;
    const locadora = this.formLocadora.controls['locadora'].value;
    const endereço = this.formLocadora.controls['endereço'].value;
    const tel = this.formLocadora.controls['telefone'].value;
    const objetoLocadora: Locadoras = {id: id, nome: locadora, endereco: endereço, telefone: tel};
    this.locadorasService.editarLocadora(objetoLocadora).subscribe({
      next: () => {
        this.id = 0;
        this.ngOnInit();
        this.alertaSnackBar("editada");
      },
      error: () => {
        console.log("Você não conseguiu fazer a alteração.");
      }
    })
  }

  // função de cadastro
  cadastrarLocadora(){

    // caso o id seja maior que 0, utiliza a função "update" no lugar de "cadastro"
    if(this.id > 0){
      this.updateLocadora()
    }
    else{
      // gera um id novo baseado no id mais alto do DB
      const id = (this.locadoras[(this.locadoras.length) - 1].id) + 1;

      // cria um novo carro com os valores dos inputs
      const locadora = this.formLocadora.controls['locadora'].value;
      const endereço = this.formLocadora.controls['endereço'].value;
      const tel = this.formLocadora.controls['telefone'].value;
      const objetoLocadora: Locadoras = {id: id, nome: locadora, endereco: endereço, telefone: tel};

      this.locadorasService.cadastrarLocadora(objetoLocadora).subscribe({
        next: () => {
          this.ngOnInit();
          this.alertaSnackBar("cadastrada");
        },
        error: () => {
          console.log("Erro ao importar a locadora.");
          this.alertaSnackBar("falha");
        }
      })
    }
  }

  // função de alerta
  alertaSnackBar(tipoAlerta: string){
    switch (tipoAlerta){
      case "cadastrada":
        this.snackBar.open("Locadora cadastrada com sucesso.", undefined, {
          duration: 2000,
          panelClass: ['snackbar-sucess']
        });
        break;
        case "editada":
          this.snackBar.open("Locadora editada com sucesso.", undefined,{
            duration: 2000,
            panelClass: ['snackbar-sucess']
          });
          break;
        case "excluída":
          this.snackBar.open("Locadora excluída com sucesso.", undefined,{
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

  // abre o dialog do botão "editar"
  openDialog (
    id: number,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {

    this.locadorasService.pegarLocadoraPeloID(id).subscribe({
      next: (locadora: Locadoras) => {
        const dialogRef = this.dialog.open(DialogEditarLocadoraComponent, {
          width: '50%',
          enterAnimationDuration,
          exitAnimationDuration,
          data: {
            id: id,
            nome: locadora.nome,
            endereco: locadora.endereco,
            telefone: locadora.telefone,
          }
        });

        // depois de confirmar, realiza as alterações
        dialogRef.afterClosed().subscribe((locadora) => {
          if (locadora) {
            this.locadorasService.editarLocadora(locadora).subscribe({
              next: () => {
                this.ngOnInit();
                this.alertaSnackBar('editada');
              },
              error: () => {
                this.alertaSnackBar('erroEditar');
              },
            })
          }
        })
      },
      error: () => {
        this.alertaSnackBar('erroEditar');
      }
    })
  }
}
