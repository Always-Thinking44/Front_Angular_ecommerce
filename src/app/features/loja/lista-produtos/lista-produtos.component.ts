import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProdutoService } from '../../../core/services/produto.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { CarrinhoStoreService } from '../../../core/services/carrinho-store.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { AuthService } from '../../../core/services/auth.service';
import { Produto, Categoria } from '../../../core/models';
import { ProdutoCardComponent } from '../../../shared/components/produto-card/produto-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, ProdutoCardComponent],
  templateUrl: './lista-produtos.component.html',
  styleUrl: './lista-produtos.component.scss',
})
export class ListaProdutosComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private categoriaService = inject(CategoriaService);
  private carrinhoStore = inject(CarrinhoStoreService);
  private notificacao = inject(NotificacaoService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  produtos = signal<Produto[]>([]);
  categorias = signal<Categoria[]>([]);
  aCarregar = signal(true);

  categoriaSelecionada: number | null = null;
  pesquisa = '';

  ngOnInit(): void {
    const categoriaParam = Number(this.route.snapshot.queryParamMap.get('categoria'));
    this.categoriaSelecionada = categoriaParam > 0 ? categoriaParam : null;

    this.categoriaService.listar().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: () => this.categorias.set([]),
    });
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.aCarregar.set(true);
    this.produtoService
      .listar({
        categoria_id: this.categoriaSelecionada ?? undefined,
        pesquisa: this.pesquisa || undefined,
      })
      .subscribe({
        next: (produtos) => {
          this.produtos.set(produtos);
          this.aCarregar.set(false);
        },
        error: () => {
          this.notificacao.erro('Não foi possível carregar os produtos.');
          this.aCarregar.set(false);
        },
      });
  }

  adicionarAoCarrinho(produto: Produto) {
    if (!this.auth.autenticado()) {
      this.notificacao.info('Inicia sessão para adicionar produtos ao carrinho.');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.carrinhoStore.adicionar(produto.id, 1).subscribe({
      next: () => {
        this.notificacao.sucesso(`"${produto.nome}" adicionado ao carrinho.`);
        this.carrinhoStore.carregar();
      },
      error: () => this.notificacao.erro('Não foi possível adicionar o produto.'),
    });
  }
}
