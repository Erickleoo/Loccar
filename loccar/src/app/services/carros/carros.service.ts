import { Carros } from './../../models/carros/carros.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarrosService {
  private listaCarros: any[];
  private url = 'http://localhost:3000/carros';

  constructor(private httpClient: HttpClient) {
    this.listaCarros = [];
  }

  get carros() {
    return this.listaCarros;
  }

  lerCarros(): Observable<Carros[]> {
    return this.httpClient.get<Carros[]>(this.url);
  }
}
