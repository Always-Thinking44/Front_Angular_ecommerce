import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CarrinhoStoreService } from '../../core/services/carrinho-store.service';
import { EncomendaService } from '../../core/services/encomenda.service';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { PagamentoMetodo } from '../../core/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  carrinhoStore = inject(CarrinhoStoreService);
  private encomendaService = inject(EncomendaService);
  private notificacao = inject(NotificacaoService);
  private router = inject(Router);

  moradaEntrega = '';
  metodoPagamento: PagamentoMetodo = 'multicaixa';
  aProcessar = signal(false);

  ngOnInit(): void {
    this.carrinhoStore.carregar();
  }

  finalizarCompra() {
    if (!this.moradaEntrega.trim()) {
      this.notificacao.erro('Indica a morada de entrega.');
      return;
    }
    if (this.carrinhoStore.itens().length === 0) {
      this.notificacao.erro('O teu carrinho está vazio.');
      return;
    }

    this.aProcessar.set(true);

    this.encomendaService
      .criar({
        endereco_entrega: this.moradaEntrega,
        metodo_pagamento: this.metodoPagamento,
      })
      .subscribe({
        next: (encomenda) => {
          this.carrinhoStore.limpar();
          this.notificacao.sucesso('Encomenda criada com sucesso!');
          this.router.navigate(['/conta/historico']);
        },
        error: () => {
          this.aProcessar.set(false);
          this.notificacao.erro('Não foi possível criar a encomenda.');
        },
      });
  }
}
