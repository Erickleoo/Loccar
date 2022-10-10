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
  nomeUsuario:String

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
        console.error("Erro ao carregar usuários!");
      }
    })
this.nomeUsuario= this.usuariosService.obterUsuarioLogin().email
  }
}
