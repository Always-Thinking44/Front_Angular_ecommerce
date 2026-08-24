import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../../core/services/produto.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { Produto, ProdutoPayload, Categoria } from '../../../core/models';

const PRODUTO_VAZIO: ProdutoPayload = {
  nome: '',
  descricao: '',
  preco: 0,
  stock: 0,
  imagem_url: '',
  categoria_id: 0,
};

@Component({
  selector: 'app-admin-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-produtos.component.html',
  styleUrl: './admin-produtos.component.scss',
})
export class AdminProdutosComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private categoriaService = inject(CategoriaService);
  private notificacao = inject(NotificacaoService);

  produtos = signal<Produto[]>([]);
  categorias = signal<Categoria[]>([]);
  aCarregar = signal(true);

  emEdicaoId: number | null = null;
  formulario: ProdutoPayload = { ...PRODUTO_VAZIO };
  aMostrarFormulario = false;

  ngOnInit(): void {
    this.categoriaService.listar().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: () => this.categorias.set([]),
    });
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.aCarregar.set(true);
    this.produtoService.listar().subscribe({
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

  novoProduto() {
    this.emEdicaoId = null;
    this.formulario = { ...PRODUTO_VAZIO };
    this.aMostrarFormulario = true;
  }

  editar(produto: Produto) {
    this.emEdicaoId = produto.id;
    this.formulario = {
      nome: produto.nome,
      descricao: produto.descricao ?? '',
      preco: produto.preco,
      stock: produto.stock,
      imagem_url: produto.imagem_url ?? '',
      categoria_id: produto.categoria_id,
    };
    this.aMostrarFormulario = true;
  }

  cancelarEdicao() {
    this.aMostrarFormulario = false;
    this.emEdicaoId = null;
  }

  guardar() {
    if (!this.formulario.nome || !this.formulario.categoria_id) {
      this.notificacao.erro('Preenche o nome e a categoria.');
      return;
    }

    const operacao = this.emEdicaoId
      ? this.produtoService.atualizar(this.emEdicaoId, this.formulario)
      : this.produtoService.criar(this.formulario);

    operacao.subscribe({
      next: () => {
        this.notificacao.sucesso(this.emEdicaoId ? 'Produto atualizado.' : 'Produto criado.');
        this.aMostrarFormulario = false;
        this.carregarProdutos();
      },
      error: () => this.notificacao.erro('Não foi possível guardar o produto.'),
    });
  }

  remover(produto: Produto) {
    if (!confirm(`Remover "${produto.nome}"?`)) return;

    this.produtoService.remover(produto.id).subscribe({
      next: () => {
        this.notificacao.sucesso('Produto removido.');
        this.carregarProdutos();
      },
      error: () => this.notificacao.erro('Não foi possível remover o produto.'),
    });
  }
}
