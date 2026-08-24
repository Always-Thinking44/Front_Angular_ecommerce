import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },

  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/registo',
    loadComponent: () =>
      import('./features/auth/registo/registo.component').then((m) => m.RegistoComponent),
  },

  {
    path: 'loja',
    loadComponent: () =>
      import('./features/loja/lista-produtos/lista-produtos.component').then(
        (m) => m.ListaProdutosComponent
      ),
  },
  {
    path: 'loja/:id',
    loadComponent: () =>
      import('./features/loja/detalhe-produto/detalhe-produto.component').then(
        (m) => m.DetalheProdutoComponent
      ),
  },

  {
    path: 'carrinho',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/carrinho/carrinho.component').then((m) => m.CarrinhoComponent),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
  },

  {
    path: 'conta/perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/conta/perfil/perfil.component').then((m) => m.PerfilComponent),
  },
  {
    path: 'conta/historico',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/conta/historico-encomendas/historico-encomendas.component').then(
        (m) => m.HistoricoEncomendasComponent
      ),
  },

  {
    path: 'admin/produtos',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/produtos/admin-produtos.component').then(
        (m) => m.AdminProdutosComponent
      ),
  },
  {
    path: 'admin/categorias',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/categorias/admin-categorias.component').then(
        (m) => m.AdminCategoriasComponent
      ),
  },
  {
    path: 'admin/encomendas',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/encomendas/admin-encomendas.component').then(
        (m) => m.AdminEncomendasComponent
      ),
  },

  { path: '**', redirectTo: 'loja' },
];
