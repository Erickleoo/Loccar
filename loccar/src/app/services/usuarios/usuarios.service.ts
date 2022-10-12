import { Usuarios } from './../../models/usuarios/usuarios.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private listaUsuarios: any[];
  private usuarios: Usuarios
  private url = 'https://servidor-carros.herokuapp.com/usuarios'

  constructor(private httpCliente: HttpClient) {
    this.listaUsuarios = [];
  }

  get usuariosCadastrados() {
    return this.listaUsuarios
  }

  lerUsuarios(): Observable<Usuarios[]> {
    return this.httpCliente.get<Usuarios[]>(this.url);
  }

  salvarUsuario(usuario: Usuarios): Observable<Usuarios> {
    return this.httpCliente.post<Usuarios>(this.url, usuario)
  }

  updateUsuario(usuario: Usuarios) {
    return this.httpCliente.put<Usuarios>(`${this.url}/${usuario.id}`, usuario);
  }

  deletarUsuario(id: any) {
    return this.httpCliente.delete(`${this.url}/${id}`)
  }

  salvarUsuarioLogin(usuario: Usuarios) {
    this.usuarios = usuario;
  }

  obterUsuarioLogin(): Usuarios {
    return this.usuarios;
  }
}
