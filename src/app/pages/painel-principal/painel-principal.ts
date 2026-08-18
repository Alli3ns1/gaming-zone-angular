import { Component, inject, signal } from '@angular/core';
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
  readonly carregando = this.productService.carregando;
  readonly erroApi = this.productService.erroApi;

  // Feedback inline para ações de exclusão e edição
  readonly mensagem = signal<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

  // ID do produto aguardando confirmação de exclusão
  readonly confirmandoExclusao = signal<number | null>(null);

  editarProduto(id: number): void {
    this.router.navigate(['/cadastro-produto', id]);
  }

  pedirConfirmacao(id: number): void {
    this.confirmandoExclusao.set(id);
  }

  cancelarExclusao(): void {
    this.confirmandoExclusao.set(null);
  }

  confirmarExclusao(): void {
    const id = this.confirmandoExclusao();
    if (id === null) return;

    this.confirmandoExclusao.set(null);
    this.productService.deletarProduto(id).subscribe({
      next: () => {
        this.mensagem.set({ texto: 'Produto excluído com sucesso!', tipo: 'sucesso' });
        this.productService.carregarProdutos();
        setTimeout(() => this.mensagem.set(null), 3000);
      },
      error: () => {
        this.mensagem.set({ texto: 'Erro ao excluir o produto. Tente novamente.', tipo: 'erro' });
        setTimeout(() => this.mensagem.set(null), 3000);
      },
    });
  }
}
