import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncomendaService } from '../../../core/services/encomenda.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { Encomenda, EncomendaEstado } from '../../../core/models';

const ESTADOS: EncomendaEstado[] = [
  'pendente',
  'paga',
  'em_preparacao',
  'enviada',
  'entregue',
  'cancelada',
];

@Component({
  selector: 'app-admin-encomendas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-encomendas.component.html',
  styleUrl: './admin-encomendas.component.scss',
})
export class AdminEncomendasComponent implements OnInit {
  private encomendaService = inject(EncomendaService);
  private notificacao = inject(NotificacaoService);

  encomendas = signal<Encomenda[]>([]);
  aCarregar = signal(true);
  estados = ESTADOS;

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.aCarregar.set(true);
    this.encomendaService.listar().subscribe({
      next: (encomendas) => {
        this.encomendas.set(encomendas);
        this.aCarregar.set(false);
      },
      error: () => {
        this.notificacao.erro('Não foi possível carregar as encomendas.');
        this.aCarregar.set(false);
      },
    });
  }

  mudarEstado(encomenda: Encomenda, novoEstado: EncomendaEstado) {
    this.encomendaService.atualizarEstado(encomenda.id, novoEstado).subscribe({
      next: (atualizada) => {
        this.encomendas.update((lista) =>
          lista.map((e) => (e.id === atualizada.id ? atualizada : e))
        );
        this.notificacao.sucesso(`Encomenda #${encomenda.id} atualizada.`);
      },
      error: () => this.notificacao.erro('Não foi possível atualizar o estado.'),
    });
  }
}
