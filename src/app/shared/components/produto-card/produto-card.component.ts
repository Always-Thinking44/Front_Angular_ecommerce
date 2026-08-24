import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Produto } from '../../../core/models';

@Component({
  selector: 'app-produto-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './produto-card.component.html',
  styleUrl: './produto-card.component.scss',
})
export class ProdutoCardComponent {
  @Input({ required: true }) produto!: Produto;
  @Output() adicionarAoCarrinho = new EventEmitter<Produto>();
}
