import { Injectable, signal } from '@angular/core';

export interface Notificacao {
  id: number;
  tipo: 'sucesso' | 'erro' | 'info';
  mensagem: string;
}

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  private contador = 0;
  readonly notificacoes = signal<Notificacao[]>([]);

  sucesso(mensagem: string) {
    this.mostrar('sucesso', mensagem);
  }

  erro(mensagem: string) {
    this.mostrar('erro', mensagem);
  }

  info(mensagem: string) {
    this.mostrar('info', mensagem);
  }

  remover(id: number) {
    this.notificacoes.update((lista) => lista.filter((n) => n.id !== id));
  }

  private mostrar(tipo: Notificacao['tipo'], mensagem: string) {
    const id = ++this.contador;
    this.notificacoes.update((lista) => [...lista, { id, tipo, mensagem }]);
    setTimeout(() => this.remover(id), 4000);
  }
}
