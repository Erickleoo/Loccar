import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Locadoras } from 'src/app/models/locadoras/locadoras.model';
import { LocadorasService } from 'src/app/services/locadoras/locadoras.service';

@Component({
  selector: 'app-locadora',
  templateUrl: './locadora.component.html',
  styleUrls: ['./locadora.component.css']
})
export class LocadoraComponent implements OnInit {
  formLocadora: FormGroup;
  error = "Este campo é obrigatório";
  id: number = 0;
  locadoras: Locadoras[]

  constructor(
    private formBuilder: FormBuilder,
    private locadorasService: LocadorasService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
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

  editarLocadora(locadora: Locadoras){
    this.id = locadora.id;
    const EditLocadora = this.formLocadora.controls['locadora'].setValue(locadora.nome);
    const EditEndereço = this.formLocadora.controls['endereço'].setValue(locadora.endereco);
    const EditTel = this.formLocadora.controls['telefone'].setValue(locadora.telefone);
    window.scroll(0,0)
  }

  excluirLocadora(id: number){
    this.locadorasService.excluirLocadora(id).subscribe({
      next: () => {
        this.ngOnInit()
        this.alertaSnackBar("excluida");
      },
      error: () => {
        console.log("Erro ao tentar excluir.");
        this.alertaSnackBar("falha");
      }
    })
  }

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

  cadastrarLocadora(){    
    if(this.id > 0){
      this.updateLocadora()
    }
    else{
      const id = (this.locadoras[(this.locadoras.length) - 1].id) + 1;
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
        case "excluida":
          this.snackBar.open("Locadora deletada com sucesso.", undefined,{
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
