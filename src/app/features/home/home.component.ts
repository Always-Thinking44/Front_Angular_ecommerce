import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProdutoService } from '../../core/services/produto.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { AuthService } from '../../core/services/auth.service';
import { Produto } from '../../core/models';
import { ProdutoCardComponent } from '../../shared/components/produto-card/produto-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProdutoCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private categoriaService = inject(CategoriaService);

  readonly auth = inject(AuthService);

  categorias = signal<{ id: number; nome: string }[]>([]);
  produtosDestaque = signal<Produto[]>([]);

  ngOnInit(): void {
    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        this.categorias.set(
          categorias.slice(0, 6).map((c) => ({ id: c.id, nome: c.nome }))
        );
      },
      error: () => this.categorias.set([]),
    });

    this.produtoService.listar().subscribe({
      next: (produtos) => this.produtosDestaque.set(produtos.slice(0, 8)),
      error: () => this.produtosDestaque.set([]),
    });
  }
}
