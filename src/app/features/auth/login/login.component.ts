import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private notificacao = inject(NotificacaoService);

  aCarregar = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submeter() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.aCarregar.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.notificacao.sucesso('Sessão iniciada com sucesso.');
        this.router.navigate(['/loja']);
      },
      error: (erro) => {
        this.aCarregar.set(false);
        const mensagem = erro?.error?.message ?? 'Credenciais inválidas.';
        this.notificacao.erro(mensagem);
      },
    });
  }
}
