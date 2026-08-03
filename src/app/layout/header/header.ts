import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart';

// jQuery é carregado globalmente via angular.json (ver seção "scripts").
// Este "declare" só avisa o TypeScript que $ existe em tempo de execução.
declare var $: any;

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements AfterViewInit {
  private readonly cart = inject(CartService);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly cartCount = this.cart.count;

  ngAfterViewInit(): void {
    // Uso real de jQuery: fecha o menu colapsado (mobile) sempre que
    // um link de âncora (#produtos, #sobre, #contato...) é clicado.
    // É exatamente o que o app.js original fazia com o Bootstrap Collapse.
    $(this.host.nativeElement)
      .find('a.nav-link[href*="#"]')
      .on('click', () => {
        const $menu = $(this.host.nativeElement).find('.navbar-collapse');
        if ($menu.hasClass('show')) {
          // API nativa do Bootstrap 5 (bundle), acessível via window.bootstrap
          const bsCollapse = (window as any).bootstrap?.Collapse.getOrCreateInstance(
            $menu.get(0)
          );
          bsCollapse?.hide();
        }
      });
  }
}
