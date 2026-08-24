import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificacaoService } from '../../../core/services/notificacao.service';

function passwordsIguaisValidator(control: AbstractControl): ValidationErrors | null {
  const senha = control.get('password')?.value;
  const confirmacao = control.get('password_confirmation')?.value;
  return senha === confirmacao ? null : { passwordsDiferentes: true };
}

@Component({
  selector: 'app-registo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registo.component.html',
  styleUrl: '../login/login.component.scss',
})
export class RegistoComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private notificacao = inject(NotificacaoService);

  aCarregar = signal(false);

  form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]],
    },
    { validators: passwordsIguaisValidator }
  );

  submeter() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.aCarregar.set(true);
    this.auth.registar(this.form.getRawValue()).subscribe({
      next: () => {
        this.notificacao.sucesso('Conta criada com sucesso!');
        this.router.navigate(['/loja']);
      },
      error: (erro) => {
        this.aCarregar.set(false);
        const mensagem = erro?.error?.message ?? 'Não foi possível criar a conta.';
        this.notificacao.erro(mensagem);
      },
    });
  }
}
