import { Usuarios } from './../../models/usuarios/usuarios.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosService } from './../../services/usuarios/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  form: FormGroup;
  error = "Este campo é obrigatório.";
  usuarios: Usuarios[];
  loading = this.loadingService.loading;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuariosService,
    private snackBar: MatSnackBar,
    private router: Router,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      tel: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required]),
      confirmacaoSenha: new FormControl('', [Validators.required])
    });

    this.usuarioService.lerUsuarios().subscribe({
      next: (usuarios: Usuarios[]) => {
        this.usuarios = usuarios;
        console.log(usuarios)
      },
      error: () => {
        this.alertaDados("falha")
      }
    })
  }

  cadastrarUsuario() {
    this.loadingService.showLoading();
    const id = (this.usuarios[(this.usuarios.length) - 1].id) + 1;
    const nome = this.form.controls["nome"].value;
    const email = this.form.controls["email"].value;
    const telefone = this.form.controls["tel"].value;
    const senha = this.form.controls["senha"].value;

    const usuario: Usuarios = { id: id, nome: nome, telefone: telefone, email: email, senha: senha };

    this.usuarioService.salvarUsuario(usuario).subscribe({
      next: () => {
        this.loadingService.hideLoading();
        this.alertaDados("sucesso");
        this.router.navigateByUrl('/login')
      },
      error: () => {
        this.loadingService.hideLoading();
        this.alertaDados("falha")
      }
    })
  }

  alertaDados(tipoExecucao: string) {
    switch (tipoExecucao) {
      case "sucesso":
        this.snackBar.open("Conta criada com sucesso.", undefined, {
          duration: 2000,
          panelClass: ['snackbar-tema']
        });
        break;
      case "falha":
        this.snackBar.open("Serviço indisponivel no momento, tente novamente mais tarde.", undefined, {
          duration: 2000,
          panelClass: ['snackbar-tema']
        });
        break;
    }
  }

  validaEmail(): string {
    if (this.form.controls["email"].hasError("required")) {
      return this.error;
    }

    return this.form.controls["email"].hasError("email") ? 'E-mail inválido' : '';
  }

  validaSenhas(): string {
    if (this.form.controls["senha"].value !== this.form.controls["confirmacaoSenha"].value) {
      this.form.controls["confirmacaoSenha"].setErrors({ camposDivergentes: true });
    }

    return this.form.controls["confirmacaoSenha"].hasError('camposDivergentes') ? 'As senhas devem ser iguais' : '';
  }
}
