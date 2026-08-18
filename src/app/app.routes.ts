import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { PainelPrincipal } from './pages/painel-principal/painel-principal';
import { CadastroProduto } from './pages/cadastro-produto/cadastro-produto';
import { Clientes } from './pages/clientes/clientes';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: Home, title: 'Gaming Zone | Loja Gamer e Tecnologia' },
  { path: 'login', component: Login, title: 'Login | Gaming Zone' },
  { path: 'painel-principal', component: PainelPrincipal, title: 'Painel Principal | Gaming Zone', canActivate: [adminGuard] },
  { path: 'cadastro-produto', component: CadastroProduto, title: 'Cadastro de Produto | Gaming Zone', canActivate: [adminGuard] },
  { path: 'cadastro-produto/:id', component: CadastroProduto, title: 'Editar Produto | Gaming Zone', canActivate: [adminGuard] },
  { path: 'clientes', component: Clientes, title: 'Gestão de Clientes | Gaming Zone', canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];
