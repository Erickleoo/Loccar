import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Locadoras } from 'src/app/models/locadoras/locadoras.model';

@Injectable({
  providedIn: 'root'
})
export class LocadorasService {
  private listaLocadoras: any[];
  private url = 'https://servidor-carros.herokuapp.com/locadoras'

  constructor(private httpClient: HttpClient) {
    this.listaLocadoras = [];
  }

  get locadoras() {
    return this.listaLocadoras;
  }

  lerLocadoras(): Observable<Locadoras[]> {
    return this.httpClient.get<Locadoras[]>(this.url);
  }

  cadastrarLocadora(objetoLocadora: Locadoras): Observable<Locadoras> {
    return this.httpClient.post<Locadoras>(this.url, objetoLocadora);
  }

  editarLocadora(objetoLocadora: Locadoras): Observable<Locadoras> {
    return this.httpClient.put<Locadoras>(`${this.url}/${objetoLocadora.id}`, objetoLocadora);
  }

  pegarLocadoraPeloID(id: number): Observable<Locadoras> {
    return this.httpClient.get<Locadoras>(`${this.url}/${id}`);
  }

  excluirLocadora(id: number): Observable<Locadoras> {
    return this.httpClient.delete<Locadoras>(`${this.url}/${id}`)
  }
}
