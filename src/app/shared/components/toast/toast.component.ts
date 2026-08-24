import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacaoService } from '../../../core/services/notificacao.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (n of notificacao.notificacoes(); track n.id) {
        <div class="toast" [class]="n.tipo" (click)="notificacao.remover(n.id)">
          {{ n.mensagem }}
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: 78px;
        right: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        z-index: 1000;
      }
      .toast {
        padding: 0.8rem 1.1rem;
        border-radius: 12px;
        color: #fff;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: var(--sombra-flutuante);
        cursor: pointer;
        max-width: 320px;
      }
      .sucesso { background: #059669; }
      .erro { background: #dc2626; }
      .info { background: var(--cor-primaria); }
    `,
  ],
})
export class ToastComponent {
  notificacao = inject(NotificacaoService);
}
