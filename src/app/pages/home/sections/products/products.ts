import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductCategory } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product';
import { CartService } from '../../../../core/services/cart';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);

  // Sinais expostos diretamente para o template (sem precisar reimplementar nada aqui)
  readonly filteredProducts = this.productService.filteredProducts;
  readonly activeFilter = this.productService.activeFilter;

  readonly filters: { value: ProductCategory | 'todos'; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'pc', label: 'PCs' },
    { value: 'jogo', label: 'Jogos' },
    { value: 'acessorio', label: 'Acessórios' },
  ];

  setFilter(filter: ProductCategory | 'todos'): void {
    this.productService.setFilter(filter);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.productService.setSearchTerm(value);
  }

  isAdded(productId: number): boolean {
    return this.cart.isAdded(productId);
  }

  addToCart(productId: number): void {
    this.cart.add(productId);
  }
}
