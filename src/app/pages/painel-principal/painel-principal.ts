import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-painel-principal',
  imports: [CurrencyPipe, RouterLink, Header, Footer],
  templateUrl: './painel-principal.html',
  styleUrl: './painel-principal.css',
})
export class PainelPrincipal {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  // Lista completa vinda da API (não filtrada, diferente da vitrine)
  readonly produtos = this.productService.produtos;

  editarProduto(id: number): void {
    this.router.navigate(['/cadastro-produto', id]);
  }

  excluirProduto(id: number): void {
    if (confirm('Deseja realmente excluir este produto?')) {
      this.productService.deletarProduto(id).subscribe(() => {
        alert('Produto excluído com sucesso!');
        this.productService.carregarProdutos();
      });
    }
  }
}
