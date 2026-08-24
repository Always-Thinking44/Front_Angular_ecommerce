import { Injectable, computed, signal } from '@angular/core';
import { CarrinhoItem } from '../models';
import { CarrinhoService } from './carrinho.service';

@Injectable({ providedIn: 'root' })
export class CarrinhoStoreService {
  private readonly _itens = signal<CarrinhoItem[]>([]);
  readonly itens = this._itens.asReadonly();

  readonly numeroItens = computed(() =>
    this._itens().reduce((total, item) => total + item.quantidade, 0)
  );

  readonly total = computed(() =>
    this._itens().reduce(
      (soma, item) => soma + item.quantidade * (item.produto?.preco ?? 0),
      0
    )
  );

  constructor(private carrinhoService: CarrinhoService) {}

  carregar(): void {
    this.carrinhoService.listar().subscribe({
      next: (itens) => this._itens.set(itens),
      error: () => this._itens.set([]),
    });
  }

  adicionar(produtoId: number, quantidade: number) {
    return this.carrinhoService.adicionar({ produto_id: produtoId, quantidade }).pipe();
  }

  definirItens(itens: CarrinhoItem[]) {
    this._itens.set(itens);
  }

  limpar() {
    this._itens.set([]);
  }
}
