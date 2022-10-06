import { Usuarios } from './../../models/usuarios/usuarios.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosService } from './../../services/usuarios/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  form: FormGroup;
  error = "Este campo é obrigatório.";
  usuarios: Usuarios[];

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuariosService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefone: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required]),
      confirmacaoSenha: new FormControl('', [Validators.required])
    });
  }

  cadastrarUsuario() {

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
