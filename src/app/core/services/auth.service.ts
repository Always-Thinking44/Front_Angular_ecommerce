import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginPayload, RegistoPayload, User } from '../models';

const TOKEN_KEY = 'ecommerce_token';
const USER_KEY = 'ecommerce_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Estado reativo do utilizador autenticado (signals do Angular 17+)
  private readonly _user = signal<User | null>(this.lerUserGuardado());
  readonly user = this._user.asReadonly();

  readonly autenticado = computed(() => !!this._user());
  readonly isAdmin = computed(() => this._user()?.role === 'admin');

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/login`, payload).pipe(
      tap((res) => this.guardarSessao(res))
    );
  }

  registar(payload: RegistoPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/registo`, payload).pipe(
      tap((res) => this.guardarSessao(res))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/logout`, {}).pipe(
      tap(() => this.limparSessao())
    );
  }

  /** Usa isto se quiseres forçar limpeza local sem chamar a API (ex: token expirado) */
  limparSessao(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
  }

  obterToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  carregarUtilizadorAtual(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user`).pipe(
      tap((user) => {
        this._user.set(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      })
    );
  }

  private guardarSessao(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this._user.set(res.user);
  }

  private lerUserGuardado(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }
}
