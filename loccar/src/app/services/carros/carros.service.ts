import { Carros } from './../../models/carros/carros.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoCarros } from 'src/app/models/tipoCarros/tipo-carros.model';

@Injectable({
  providedIn: 'root'
})
export class CarrosService {
  private listaCarros: any[];
  private url = 'https://servidor-carros.herokuapp.com/carros';
  private urlTipo = 'https://servidor-carros.herokuapp.com/tipoCarros';
  carroSelecionadoId = 0;
  dadosCarroId = new BehaviorSubject<number>(this.carroSelecionadoId);

  constructor(private httpClient: HttpClient) {
    this.listaCarros = [];
  }

  get carros() {
    return this.listaCarros;
  }

  lerCarros(): Observable<Carros[]> {
    return this.httpClient.get<Carros[]>(this.url);
  }
  lerTipos(): Observable<TipoCarros[]> {
    return this.httpClient.get<TipoCarros[]>(this.urlTipo)
  }
  salvarCarros(carros: Carros): Observable<Carros> {
    return this.httpClient.post<Carros>(this.url, carros);
  }

  deletarCarros(id: number): Observable<Carros> {
    console.log(`${this.url}/${id}`)
    return this.httpClient.delete<Carros>(`${this.url}/${id}`);
  }

  pegarCarrosPeloID(id: number): Observable<Carros> {
    return this.httpClient.get<Carros>(`${this.url}/${id}`);
  }
  tipoById(id: any): Observable<TipoCarros> {
    return this.httpClient.get<TipoCarros>(`${this.urlTipo}/${id}`);
  }
  atualizarCarros(carros: Carros): Observable<Carros> {
    let endpoint = carros.id;
    return this.httpClient.put<Carros>(`${this.url}/${endpoint}`, carros);
  }
  carrosByTipe(nome: string) {
    return this.httpClient.get(`${this.urlTipo}/${nome}`);
  }

  getCarroSelecionadoId(): Observable<number> {
    return this.dadosCarroId.asObservable();
  }

  salvarCarroSelecionadoId(id: number) {
    this.dadosCarroId.next(id);
  }

}
