import { Component, OnInit, inject } from '@angular/core';
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
      this.productService.obterProdutoPorId(Number(idParam)).subscribe((dados) => {
        this.produto = dados;
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
      this.productService.atualizarProduto(this.produto.id, this.produto).subscribe(() => {
        alert('Produto atualizado com sucesso!');
        this.productService.carregarProdutos();
        this.router.navigate(['/painel-principal']);
      });
    } else {
      // POST - sem id, é um novo cadastro
      this.productService.adicionarProduto(this.produto).subscribe(() => {
        alert('Produto cadastrado com sucesso!');
        this.productService.carregarProdutos();
        this.router.navigate(['/painel-principal']);
      });
    }
  }
}
