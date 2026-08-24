import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../core/services/categoria.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { Categoria, CategoriaPayload } from '../../../core/models';

const CATEGORIA_VAZIA: CategoriaPayload = { nome: '', descricao: '' };

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categorias.component.html',
  styleUrl: './admin-categorias.component.scss',
})
export class AdminCategoriasComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private notificacao = inject(NotificacaoService);

  categorias = signal<Categoria[]>([]);
  aCarregar = signal(true);

  emEdicaoId: number | null = null;
  formulario: CategoriaPayload = { ...CATEGORIA_VAZIA };
  aMostrarFormulario = false;

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.aCarregar.set(true);
    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.aCarregar.set(false);
      },
      error: () => {
        this.notificacao.erro('Não foi possível carregar as categorias.');
        this.aCarregar.set(false);
      },
    });
  }

  nova() {
    this.emEdicaoId = null;
    this.formulario = { ...CATEGORIA_VAZIA };
    this.aMostrarFormulario = true;
  }

  editar(categoria: Categoria) {
    this.emEdicaoId = categoria.id;
    this.formulario = { nome: categoria.nome, descricao: categoria.descricao ?? '' };
    this.aMostrarFormulario = true;
  }

  cancelarEdicao() {
    this.aMostrarFormulario = false;
    this.emEdicaoId = null;
  }

  guardar() {
    if (!this.formulario.nome) {
      this.notificacao.erro('Indica o nome da categoria.');
      return;
    }

    const operacao = this.emEdicaoId
      ? this.categoriaService.atualizar(this.emEdicaoId, this.formulario)
      : this.categoriaService.criar(this.formulario);

    operacao.subscribe({
      next: () => {
        this.notificacao.sucesso(this.emEdicaoId ? 'Categoria atualizada.' : 'Categoria criada.');
        this.aMostrarFormulario = false;
        this.carregar();
      },
      error: () => this.notificacao.erro('Não foi possível guardar a categoria.'),
    });
  }

  remover(categoria: Categoria) {
    if (!confirm(`Remover a categoria "${categoria.nome}"?`)) return;

    this.categoriaService.remover(categoria.id).subscribe({
      next: () => {
        this.notificacao.sucesso('Categoria removida.');
        this.carregar();
      },
      error: () =>
        this.notificacao.erro(
          'Não foi possível remover. Pode haver produtos associados a esta categoria.'
        ),
    });
  }
}
