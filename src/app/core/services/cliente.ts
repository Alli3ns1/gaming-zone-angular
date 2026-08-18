import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { AuthService } from './auth';

/**
 * Serviço responsável pelo CRUD de clientes integrado ao JSON Server (http://localhost:3000/clientes).
 */
@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = 'http://localhost:3000/clientes';

  private readonly clients = signal<Cliente[]>([]);
  readonly clientes = computed(() => this.clients());

  readonly carregando = signal(false);
  readonly erroApi = signal<string | null>(null);

  constructor() {
    this.carregarClientes();
  }

  /** GET /clientes - busca a lista de clientes da API */
  carregarClientes(): void {
    this.carregando.set(true);
    this.erroApi.set(null);

    this.http
      .get<Cliente[]>(this.apiUrl)
      .pipe(
        catchError(() => {
          this.erroApi.set(
            'Não foi possível carregar a lista de clientes. Verifique se o servidor da API está ativo (npm run api).'
          );
          return of([]);
        })
      )
      .subscribe((dados) => {
        this.clients.set(dados);
        this.carregando.set(false);
      });
  }

  /** GET /clientes/:id */
  obterClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  /** POST /clientes */
  adicionarCliente(cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  /** PUT /clientes/:id */
  atualizarCliente(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  /** DELETE /clientes/:id - remove da API e do armazenamento de login */
  deletarCliente(id: number, nome?: string): Observable<unknown> {
    if (nome) {
      this.auth.deleteUser(nome);
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
