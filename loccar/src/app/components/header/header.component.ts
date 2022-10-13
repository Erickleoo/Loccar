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
  nomeUsuario: boolean;
  storage: Storage;

  constructor(
    public router: Router,
    private usuariosService: UsuariosService,
    private auth: AuthService,

  ) {
    this.storage = window.localStorage;
  }

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
    if (JSON.parse(this.storage.getItem('key') || '{}') === 'paulo@email.com') {
      return true
    } else {
      return false
    }
  }

  sair() {
    this.auth.logout();
  }
}

