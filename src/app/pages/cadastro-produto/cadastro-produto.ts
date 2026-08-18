import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product, ProductCategory } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-cadastro-produto',
  imports: [FormsModule, RouterLink, Header, Footer],
  templateUrl: './cadastro-produto.html',
  styleUrl: './cadastro-produto.css',
})
export class CadastroProduto implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly categorias: ProductCategory[] = ['pc', 'jogo', 'acessorio'];

  // Feedback inline substituindo alert()
  readonly mensagem = signal<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

  // Objeto ligado ao formulário via [(ngModel)]. Sem "id" = modo cadastro.
  produto: Partial<Product> = {
    category: 'pc',
    name: '',
    tag: '',
    title: '',
    description: '',
    price: 0,
    image: '',
    imageAlt: '',
  };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    // Se veio um :id na rota, é edição: carrega o produto da API e preenche o form.
    if (idParam) {
      this.productService.obterProdutoPorId(Number(idParam)).subscribe({
        next: (dados) => (this.produto = dados),
        error: () =>
          this.mensagem.set({ texto: 'Erro ao carregar produto para edição.', tipo: 'erro' }),
      });
    }
  }

  salvarProduto(): void {
    // "name" é usado na busca da vitrine; se não foi digitado, deriva do título.
    if (!this.produto.name) {
      this.produto.name = (this.produto.title ?? '').toLowerCase();
    }

    if (this.produto.id) {
      // PUT - já existe id, então é atualização
      this.productService.atualizarProduto(this.produto.id, this.produto).subscribe({
        next: () => {
          this.mensagem.set({ texto: 'Produto atualizado com sucesso!', tipo: 'sucesso' });
          this.productService.carregarProdutos();
          setTimeout(() => this.router.navigate(['/painel-principal']), 1200);
        },
        error: () =>
          this.mensagem.set({ texto: 'Erro ao atualizar o produto. Tente novamente.', tipo: 'erro' }),
      });
    } else {
      // POST - sem id, é um novo cadastro
      this.productService.adicionarProduto(this.produto).subscribe({
        next: () => {
          this.mensagem.set({ texto: 'Produto cadastrado com sucesso!', tipo: 'sucesso' });
          this.productService.carregarProdutos();
          setTimeout(() => this.router.navigate(['/painel-principal']), 1200);
        },
        error: () =>
          this.mensagem.set({ texto: 'Erro ao cadastrar o produto. Tente novamente.', tipo: 'erro' }),
      });
    }
  }
}
