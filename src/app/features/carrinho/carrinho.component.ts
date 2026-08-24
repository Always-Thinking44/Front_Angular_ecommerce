import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { CarrinhoStoreService } from '../../core/services/carrinho-store.service';
import { NotificacaoService } from '../../core/services/notificacao.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.scss',
})
export class CarrinhoComponent implements OnInit {
  private carrinhoService = inject(CarrinhoService);
  carrinhoStore = inject(CarrinhoStoreService);
  private notificacao = inject(NotificacaoService);

  ngOnInit(): void {
    this.carrinhoStore.carregar();
  }

  alterarQuantidade(id: number, quantidade: number) {
    if (quantidade < 1) return;
    this.carrinhoService.atualizarQuantidade(id, quantidade).subscribe({
      next: () => this.carrinhoStore.carregar(),
      error: () => this.notificacao.erro('Não foi possível atualizar a quantidade.'),
    });
  }

  removerItem(id: number) {
    this.carrinhoService.remover(id).subscribe({
      next: () => {
        this.carrinhoStore.carregar();
        this.notificacao.info('Produto removido do carrinho.');
      },
      error: () => this.notificacao.erro('Não foi possível remover o produto.'),
    });
  }
}
