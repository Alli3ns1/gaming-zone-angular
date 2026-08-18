import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart';
import { AuthService } from '../../core/services/auth';

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
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly cartCount = this.cart.count;
  readonly currentUser = this.auth.currentUser;
  readonly isLoggedIn = this.auth.isLoggedIn;
  readonly isAdmin = this.auth.isAdmin;

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  ngAfterViewInit(): void {
    // Fecha o menu colapsado (mobile) sempre que um link de âncora é clicado.
    $(this.host.nativeElement)
      .find('a.nav-link[href*="#"]')
      .on('click', () => {
        const $menu = $(this.host.nativeElement).find('.navbar-collapse');
        if ($menu.hasClass('show')) {
          const bsCollapse = (window as any).bootstrap?.Collapse.getOrCreateInstance(
            $menu.get(0)
          );
          bsCollapse?.hide();
        }
      });
  }
}
