import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Product, ProductCategory } from '../models/product.model';

/**
 * Antes: os produtos ficavam fixos direto neste service (um array no signal).
 *
 * Agora: os produtos vêm do json-server (http://localhost:3000/produtos).
 * O signal `products` continua existindo, mas quem o preenche é a resposta
 * da API (GET), e as ações de cadastro/edição/exclusão passam pelo
 * HttpClient (POST, PUT, DELETE) e depois recarregam a lista.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/produtos';

  private readonly products = signal<Product[]>([]);

  /** Estado de carregamento e erro, usados nos templates para feedback ao usuário. */
  readonly carregando = signal(false);
  readonly erroApi = signal<string | null>(null);

  // Lista completa, usada pelo Painel Principal (admin)
  readonly produtos = computed(() => this.products());

  // Estado do filtro/busca, usado pela vitrine (Home > Products)
  readonly activeFilter = signal<ProductCategory | 'todos'>('todos');
  readonly searchTerm = signal('');

  // computed() recalcula automaticamente sempre que products, activeFilter ou searchTerm mudam
  readonly filteredProducts = computed(() => {
    const filter = this.activeFilter();
    const term = this.searchTerm().toLowerCase().trim();

    return this.products().filter((product) => {
      const categoryMatches = filter === 'todos' || product.category === filter;
      const productName = (product.name || product.title || '').toLowerCase();
      const nameMatches = productName.includes(term);
      return categoryMatches && nameMatches;
    });
  });


  constructor() {
    this.carregarProdutos();
  }

  /** GET /produtos - busca a lista da API e atualiza o signal. */
  carregarProdutos(): void {
    this.carregando.set(true);
    this.erroApi.set(null);

    this.http
      .get<Product[]>(this.apiUrl)
      .pipe(
        catchError(() => {
          this.erroApi.set(
            'Não foi possível conectar à API. Verifique se o servidor está rodando (npm run api).'
          );
          return of([]);
        })
      )
      .subscribe((dados) => {
        this.products.set(dados);
        this.carregando.set(false);
      });
  }

  /** GET /produtos/:id - usado na tela de Cadastro para carregar dados na edição. */
  obterProdutoPorId(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /** POST /produtos - cadastra um novo produto. */
  adicionarProduto(produto: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, produto);
  }

  /** PUT /produtos/:id - atualiza um produto existente. */
  atualizarProduto(id: number, produto: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, produto);
  }

  /** DELETE /produtos/:id - remove um produto. */
  deletarProduto(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  setFilter(filter: ProductCategory | 'todos'): void {
    this.activeFilter.set(filter);
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }
}
