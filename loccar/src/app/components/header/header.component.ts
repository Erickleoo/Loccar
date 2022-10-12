import { AuthService } from 'src/app/services/auth/auth.service.service';
import { UsuariosService } from './../../services/usuarios/usuarios.service';
import { Usuarios } from './../../models/usuarios/usuarios.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  usuarios: Usuarios[];
  nomeUsuario: boolean

  constructor(
    public router: Router,
    private usuariosService: UsuariosService,
    private auth:AuthService,
  ) { }

  ngOnInit(): void {
    // this.usuariosService.lerUsuarios().subscribe({
    //   next: (usuarios: Usuarios[]) => {
    //     this.usuarios = usuarios;
    //   },
    //   error: () => {
    //     console.error("Erro ao carregar usuarios!");
    //   }
    // })
    this.nomeUsuario = this.checkStatus();
  }
  checkStatus() {
    if (this.usuariosService.obterUsuarioLogin().email === 'paulo@email.com') {
      return true
    } else return false
  }

  sair(){
    this.auth.logout();
  }
}

