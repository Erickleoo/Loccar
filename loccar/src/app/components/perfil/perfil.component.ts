import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Usuarios } from 'src/app/models/usuarios/usuarios.model';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  form: FormGroup;
  usuarios: Usuarios[];
  nomeUsuario:Boolean
  constructor(
    private formBuilder: FormBuilder,
    private Usuarios: UsuariosService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: new FormControl(''),
      email: new FormControl(''),
      telefone: new FormControl('')
    })

    this.Usuarios.lerUsuarios().subscribe({
      next:(usuario: Usuarios[]) => {
        this.usuarios = usuario

      },
      error: () => {
        console.error("Erro ao ler os usuarios!");
        this.alertaSnackBar("falha");
      }
    })
    this.nomeUsuario=this.checkStatus();

  }

  removerUsuario(id: any){
    this.Usuarios.deletarUsuario(id).subscribe({
      next: () => {
        this.ngOnInit()
        this.alertaSnackBar("deletado");
      },
      error: () => {
        console.error("Erro ao excluir usuario!");
        this.alertaSnackBar("falha");
      }
    })
  }

  alertaSnackBar(tipoAlerta: string) {
    switch (tipoAlerta) {
      case "deletado":
        this.snackBar.open("Usuario excluido com sucesso.", undefined,{duration: 2000});
        break;
      case "falha":
        this.snackBar.open("Serviço indisponível no momento, tente novamente mais tarde.", undefined, {duration: 2000});
        break;
    }
  }
   checkStatus(){
    if(this.Usuarios.obterUsuarioLogin().email==='paulo@email.com'){
      return true
    }else return false
  }

}
