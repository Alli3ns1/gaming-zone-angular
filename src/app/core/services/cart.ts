import { Injectable, computed, signal } from '@angular/core';

/**
 * Antes: "cartCount" era uma variável solta no closure do app.js e o
 * botão "Adicionar" virava "Adicionado" manipulando classList direto.
 *
 * Agora: um signal guarda os IDs já adicionados; o contador é derivado
 * (computed) do tamanho desse conjunto. Qualquer componente que injete
 * o CartService recebe o valor sempre atualizado, sem precisar "ouvir" nada.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly addedProductIds = signal<Set<number>>(new Set());

  readonly count = computed(() => this.addedProductIds().size);

  isAdded(productId: number): boolean {
    return this.addedProductIds().has(productId);
  }

  add(productId: number): void {
    this.addedProductIds.update((current) => {
      const next = new Set(current);
      next.add(productId);
      return next;
    });
  }
}
