import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuarios } from 'src/app/models/usuarios/usuarios.model';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogExcluirComponent } from '../view/dialog-excluir/dialog-excluir.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  form: FormGroup;
  usuarios: Usuarios[];
  id: number = 0;
  senha: any = ''
  foto: any = ''
  error = "Este campo é obrigatório";
  nomeUsuario:Boolean

  constructor(
    private formBuilder: FormBuilder,
    private Usuarios: UsuariosService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

ngOnInit(): void {
  this.form = this.formBuilder.group({
    nome: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required]),
    telefone: new FormControl('',[Validators.required])
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

selecionarUsuario(usuario: Usuarios){
  this.id = usuario.id;
  this.senha = usuario.senha
  this.foto = usuario.foto
  const selectLocadora = this.form.controls['nome'].setValue(usuario.nome);
  const selectEndereço = this.form.controls['email'].setValue(usuario.email);
  const selectTelefone = this.form.controls['telefone'].setValue(usuario.telefone);
  window.scroll(0,0)
}

AtualizarUsuario(){
  const id = this.id;
  const nome = this.form.controls['nome'].value;
  const email = this.form.controls['email'].value;
  const telefone = this.form.controls['telefone'].value;
  const senha = this.senha;
  const foto = this.foto;
  const usuario: Usuarios = {id: id, nome: nome, senha: senha, email: email, telefone: telefone, foto: foto};
  this.Usuarios.updateUsuario(usuario).subscribe({
    next: () => {
      this.id = 0;
      this.ngOnInit();
      this.alertaSnackBar("atualizado");
    },
    error: () => {
      console.error("Você não conseguiu fazer a alteração.");
      this.alertaSnackBar("falha");
    }
  })
}

removerUsuario(id: any): void {
  let text;
  const dialogRef = this.dialog.open(DialogExcluirComponent, {
    width: '550px',
    data: text
  });

  dialogRef.afterClosed().subscribe(boolean => {
    if (boolean) {
      this.Usuarios.deletarUsuario(id).subscribe({
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
    case "deletado":
      this.snackBar.open("Usuario excluido com sucesso.", undefined,{duration: 2000});
      break;
    case "atualizado":
      this.snackBar.open("Usuario atualizado com sucesso.", undefined,{duration: 2000});
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
