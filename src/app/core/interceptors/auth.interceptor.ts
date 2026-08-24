import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor funcional (estilo Angular 17+/18 standalone).
 * 1. Anexa "Authorization: Bearer <token>" a cada pedido para a nossa API.
 * 2. Se a API responder 401 (token inválido/expirado), limpa a sessão e
 *    redireciona para o login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.obterToken();

  const reqComToken = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
    : req.clone({ setHeaders: { Accept: 'application/json' } });

  return next(reqComToken).pipe(
    catchError((erro) => {
      if (erro.status === 401) {
        auth.limparSessao();
        router.navigate(['/auth/login']);
      }
      return throwError(() => erro);
    })
  );
};
