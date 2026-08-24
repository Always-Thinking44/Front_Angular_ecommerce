import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncomendaService } from '../../../core/services/encomenda.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { Encomenda } from '../../../core/models';

@Component({
  selector: 'app-historico-encomendas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historico-encomendas.component.html',
  styleUrl: './historico-encomendas.component.scss',
})
export class HistoricoEncomendasComponent implements OnInit {
  private encomendaService = inject(EncomendaService);
  private notificacao = inject(NotificacaoService);

  encomendas = signal<Encomenda[]>([]);
  aCarregar = signal(true);

  ngOnInit(): void {
    this.encomendaService.listar().subscribe({
      next: (encomendas) => {
        this.encomendas.set(encomendas);
        this.aCarregar.set(false);
      },
      error: () => {
        this.notificacao.erro('Não foi possível carregar as tuas encomendas.');
        this.aCarregar.set(false);
      },
    });
  }

  cancelar(id: number) {
    this.encomendaService.cancelar(id).subscribe({
      next: (atualizada) => {
        this.encomendas.update((lista) =>
          lista.map((e) => (e.id === id ? atualizada : e))
        );
        this.notificacao.sucesso('Encomenda cancelada.');
      },
      error: () => this.notificacao.erro('Não foi possível cancelar a encomenda.'),
    });
  }

  podeCancelar(estado: string): boolean {
    return estado === 'pendente' || estado === 'paga';
  }
}
