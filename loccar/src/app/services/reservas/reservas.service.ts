import { Reservas } from './../../models/reservas/reservas.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private listaReservas: any[];
  private url = 'https://servidor-carros.herokuapp.com/reservas';

  constructor(private httpClient: HttpClient) {
    this.listaReservas = [];
  }

  get reservas() {
    return this.listaReservas;
  }

  lerReservas(): Observable<Reservas[]> {
    return this.httpClient.get<Reservas[]>(this.url);
  }

  salvarReservas(reservas: Reservas): Observable<Reservas> {
    return this.httpClient.post<Reservas>(this.url, reservas);
  }

  deletarReservas(id: number): Observable<Reservas> {
    return this.httpClient.delete<Reservas>(`${this.url}/${id}`);
  }

  pegarReservasPeloID(id: number): Observable<Reservas> {
    return this.httpClient.get<Reservas>(`${this.url}/${id}`);
  }

  atualizarReservas(reservas: Reservas): Observable<Reservas> {
    let endpoint = reservas.id;
    return this.httpClient.put<Reservas>(`${this.url}/${endpoint}`, reservas);
  }

}
