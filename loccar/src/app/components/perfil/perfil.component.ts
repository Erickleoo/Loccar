import { Usuarios } from './../../models/usuarios/usuarios.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogExcluirComponent } from '../view/dialog-excluir/dialog-excluir.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  form: FormGroup;
  usuarios: Usuarios[];
  error = "Este campo é obrigatório";
  nomeUsuario: Boolean
  idUsuario: number

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      telefone: new FormControl('', [Validators.required])
    })

    // Ler os usuários no DB e salvar na array "Usuarios"
    this.usuariosService.lerUsuarios().subscribe({
      next: (usuario: Usuarios[]) => {
        this.usuarios = usuario

      },
      error: () => {
        console.error("Erro ao ler os usuarios!");
        this.alertaSnackBar("falha");
      }
    })

    // Verificar se o usuario é o ADM
    this.nomeUsuario = this.checkStatus();


    if (this.checkStatus() === false) {
      this.dadosUsuarioNaoAdimn()
    }
    this.idUsuario = this.usuariosService.obterUsuarioLogin().id


  }

  // Pega os valores do card e coloca nos inputs
  selecionarUsuario(usuario: Usuarios) {

    this.form.controls['nome'].setValue(usuario.nome);
    this.form.controls['email'].setValue(usuario.email);
    this.form.controls['telefone'].setValue(usuario.telefone);
    window.scroll(0, 0)
  }

  // Abre o dialog de confirmação para excluir
  removerUsuario(id: number): void {
    let text;
    const dialogRef = this.dialog.open(DialogExcluirComponent, {
      width: '550px',
      data: text
    });

    // Depois de confirmar, exclui o usuário pelo id
    dialogRef.afterClosed().subscribe(boolean => {
      if (boolean) {
        this.usuariosService.deletarUsuario(id).subscribe({
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
      case "deletado":
        this.snackBar.open("Usuario excluido com sucesso.", undefined, { duration: 2000 });
        break;
      case "atualizado":
        this.snackBar.open("Usuario atualizado com sucesso.", undefined, { duration: 2000 });
        break;
      case "falha":
        this.snackBar.open("Serviço indisponível no momento, tente novamente mais tarde.", undefined, { duration: 2000 });
        break;
    }
  }

  // função para saber se é o ADM
  checkStatus() {
    if (this.usuariosService.obterUsuarioLogin().email === 'paulo@email.com') {
      return true
    } else return false
  }

  // função para registar qual usuario realizou o login
  pegarDados() {
    this.usuariosService.obterUsuarioLogin()

  }

  // Pega os valores dos dados do usuário caso não seja ADM
  dadosUsuarioNaoAdimn() {
    let id = this.usuariosService.obterUsuarioLogin().id

    this.usuariosService.pegarUsuarioPeloId(id).subscribe({
      next: (usuario) => {
        this.form.controls['nome'].setValue(usuario.nome);
        this.form.controls['email'].setValue(usuario.email);
        this.form.controls['telefone'].setValue(usuario.telefone);
      },
      error: () => {
        console.error("Erro ao pegar usuário!");
      }
    })
  }

  // atualiza os dados do usuario no DB com os valores colocados nos inputs
  atualizarDados() {
    let id = this.usuariosService.obterUsuarioLogin().id
    let senha = this.usuariosService.obterUsuarioLogin().senha
    const nome = this.form.controls['nome'].value;
    const email = this.form.controls['email'].value;
    const telefone = this.form.controls['telefone'].value;
    const usuario: Usuarios = { id: id, nome: nome, senha: senha, email: email, telefone: telefone };
    this.usuariosService.updateUsuario(usuario).subscribe({
      next: () => {
        this.ngOnInit();
        this.alertaSnackBar("atualizado");
      },
      error: () => {
        console.error("Você não conseguiu fazer a alteração.");
        this.alertaSnackBar("falha");
      }
    })

  }

}
