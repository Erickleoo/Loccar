import { Router } from '@angular/router';
import { LoadingService } from './../../services/loading/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuarios } from './../../models/usuarios/usuarios.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { AuthService } from 'src/app/services/auth/auth.service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error = 'Este campo é obrigatório';
  usuarios: Usuarios[];
  loading = this.loadingService.loading;
  private storage: Storage;

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService,
    private route: Router,
    private auth: AuthService,
  ) {
    this.storage = window.localStorage;
  }

  ngOnInit(): void {
    this.loadingService.showLoading();
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required])
    });

    this.usuariosService.lerUsuarios().subscribe({
      next: (usuarios: Usuarios[]) => {
        this.usuarios = usuarios;
        this.loadingService.hideLoading();
      },
      error: () => {
        this.alertaSnackBar("sistemaindisponivel");
        this.loadingService.hideLoading();
      }
    });
  }

  realizarLogin() {
    let usuario = this.validarUsuario();

    if (!usuario) {
      this.alertaSnackBar("usuarioInexistente");
    }
    else {
      this.validarSenha(usuario);

    }
  }


  validarUsuario(): any {
    for (let usuario of this.usuarios) {
      if (usuario.email === this.form.controls["email"].value) return usuario
    }
    return null
  }

  validarSenha(usuario: Usuarios) {
    if (usuario.senha === this.form.controls["senha"].value) {
      this.alertaSnackBar("loginSucesso");
      this.route.navigateByUrl("/perfil");
      this.usuariosService.salvarUsuarioLogin(usuario)
      this.usuariosService.salvarLocalStorage(usuario);
      this.usuariosService.consultarLocalStorage('key');
      JSON.parse(this.storage.getItem('key') || '{}');
      console.log(JSON.parse(this.storage.getItem('key') || '{}'))
    }
    else {
      this.alertaSnackBar("usuarioInexistente")
    }
  }

  alertaSnackBar(tipoAlerta: string) {
    switch (tipoAlerta) {
      case "sistemaindisponivel":
        this.snackBar.open("Sistema temporariamente indisponível.", undefined, {
          duration: 2000,
          panelClass: ['snackbar-tema']
        })
        break;
      case "usuarioInexistente":
        this.snackBar.open("E-mail ou senha incorreto(s)", undefined, {
          duration: 2000,
          panelClass: ['snackbar-tema']
        })
        break;
      case "loginSucesso":
        this.snackBar.open("Login realizado com sucesso", undefined, {
          duration: 2000,
          panelClass: ['snackbar-tema']
        })
        break;
    }
  }
  signInWithGoogle() {
    this.auth.googleSignIn();
  }

}
