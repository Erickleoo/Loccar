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
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    this.usuariosService.lerUsuarios().subscribe({
      next: (usuarios: Usuarios[]) => {
        this.usuarios = usuarios;
      },
      error: () => {
        console.error("Erro ao carregar usuÃ¡rios!");
      }
    })
    this.nomeUsuario = this.checkStatus();
  }
  checkStatus() {
    if (this.usuariosService.obterUsuarioLogin().email === 'paulo@email.com') {
      return true
    } else return false
    this.nomeUsuario = this.checkStatus();
  }
}

