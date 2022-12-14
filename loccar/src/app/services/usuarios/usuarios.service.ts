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
  private storage: Storage;

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

  updateUsuario(usuario: Usuarios): Observable<Usuarios> {
    let endpoint = usuario.id;
    return this.httpCliente.put<Usuarios>(`${this.url}/${endpoint}`, usuario);
  }

  deletarUsuario(id: any): Observable<Usuarios> {
    return this.httpCliente.delete<Usuarios>(`${this.url}/${id}`)
  }

  salvarUsuarioLogin(usuario: Usuarios) {
    this.usuarios = usuario;
  }

  obterUsuarioLogin(): Usuarios {
    return this.usuarios;
  }


  pegarUsuarioPeloId(id: number): Observable<Usuarios> {
    return this.httpCliente.get<Usuarios>(`${this.url}/${id}`);
  }

  salvarLocalStorage(data: Usuarios) {
    localStorage.setItem('key', JSON.stringify(data.email))
  }

  consultarLocalStorage(key: string): any {
    if (this.storage) {
      return JSON.parse(this.storage.getItem(key) || '{}');
    }
    return null;
  }
}
