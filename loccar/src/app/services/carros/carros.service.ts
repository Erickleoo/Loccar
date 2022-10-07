import { Carros } from './../../models/carros/carros.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoCarros } from 'src/app/models/tipoCarros/tipo-carros.model';

@Injectable({
  providedIn: 'root'
})
export class CarrosService {
  private listaCarros: any[];
  private url = 'https://servidor-carros.herokuapp.com/carros';
  private urlTipo ='https://servidor-carros.herokuapp.com/tipoCarros'

  constructor(private httpClient: HttpClient) {
    this.listaCarros = [];
  }

  get carros() {
    return this.listaCarros;
  }

  lerCarros(): Observable<Carros[]> {
    return this.httpClient.get<Carros[]>(this.url);
  }
lerTipos():Observable<TipoCarros[]>{
  return this.httpClient.get<TipoCarros[]>(this.urlTipo)
}
  salvarCarros(carros: Carros): Observable<Carros> {
    return this.httpClient.post<Carros>(this.url, carros);
  }

  deletarCarros(id: number): Observable<Carros> {
    console.log(`${this.url}/${id}`)
    return this.httpClient.delete<Carros>(`${this.url}/${id}`);
  }

  pegarCarrosPeloID(id: number) : Observable<Carros>{
    return this.httpClient.get<Carros>(`${this.url}/${id}`);
  }

  atualizarCarros(carros: Carros): Observable<Carros> {
    let endpoint = carros.id;
    return this.httpClient.put<Carros>(`${this.url}/${endpoint}`, carros);
  }
  carrosByTipe(nome:string){
    return this.httpClient.get(`${this.urlTipo}/${nome}`);
  }

}
