import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../../../core/services/produto.service';
import { AvaliacaoService } from '../../../core/services/avaliacao.service';
import { CarrinhoStoreService } from '../../../core/services/carrinho-store.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { AuthService } from '../../../core/services/auth.service';
import { Produto, Avaliacao } from '../../../core/models';

@Component({
  selector: 'app-detalhe-produto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalhe-produto.component.html',
  styleUrl: './detalhe-produto.component.scss',
})
export class DetalheProdutoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private produtoService = inject(ProdutoService);
  private avaliacaoService = inject(AvaliacaoService);
  private carrinhoStore = inject(CarrinhoStoreService);
  private notificacao = inject(NotificacaoService);
  auth = inject(AuthService);

  produto = signal<Produto | null>(null);
  avaliacoes = signal<Avaliacao[]>([]);
  quantidade = 1;
  aCarregar = signal(true);

  novaAvaliacao = { classificacao: 5, comentario: '' };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.produtoService.obter(id).subscribe({
      next: (produto) => {
        this.produto.set(produto);
        this.aCarregar.set(false);
      },
      error: () => {
        this.notificacao.erro('Produto não encontrado.');
        this.router.navigate(['/loja']);
      },
    });

    this.avaliacaoService.listarPorProduto(id).subscribe({
      next: (avaliacoes) => this.avaliacoes.set(avaliacoes),
      error: () => this.avaliacoes.set([]),
    });
  }

  adicionarAoCarrinho() {
    if (!this.auth.autenticado()) {
      this.notificacao.info('Inicia sessão para adicionar produtos ao carrinho.');
      this.router.navigate(['/auth/login']);
      return;
    }

    const produto = this.produto();
    if (!produto) return;

    this.carrinhoStore.adicionar(produto.id, this.quantidade).subscribe({
      next: () => {
        this.notificacao.sucesso('Produto adicionado ao carrinho.');
        this.carrinhoStore.carregar();
      },
      error: () => this.notificacao.erro('Não foi possível adicionar o produto.'),
    });
  }

  submeterAvaliacao() {
    const produto = this.produto();
    if (!produto) return;

    this.avaliacaoService
      .criar({
        produto_id: produto.id,
        classificacao: this.novaAvaliacao.classificacao,
        comentario: this.novaAvaliacao.comentario,
      })
      .subscribe({
        next: (avaliacao) => {
          this.avaliacoes.update((lista) => [avaliacao, ...lista]);
          this.novaAvaliacao = { classificacao: 5, comentario: '' };
          this.notificacao.sucesso('Avaliação enviada. Obrigado!');
        },
        error: () => this.notificacao.erro('Não foi possível enviar a avaliação.'),
      });
  }
}
