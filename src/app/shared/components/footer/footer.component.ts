import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-inner">
        <div class="coluna marca-coluna">
          <span class="marca">Minha<em>Loja</em></span>
          <p>
            Tudo o que procuras, num só lugar. Electrónica, casa, moda e muito
            mais, com entrega rápida em todo o país.
          </p>
        </div>

        <div class="coluna">
          <h4>Loja</h4>
          <a routerLink="/loja">Todos os produtos</a>
          <a routerLink="/carrinho">O meu carrinho</a>
          <a routerLink="/conta/historico">As minhas encomendas</a>
        </div>

        <div class="coluna">
          <h4>Conta</h4>
          <a routerLink="/auth/login">Entrar</a>
          <a routerLink="/auth/registo">Criar conta</a>
          <a routerLink="/conta/perfil">O meu perfil</a>
        </div>
      </div>

      <div class="footer-base">
        © {{ ano }} MinhaLoja. Todos os direitos reservados.
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        margin-top: auto;
        background: #0f172a;
        color: #cbd5e1;
      }

      .footer-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2.5rem 1.5rem;
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 2rem;
      }

      .marca {
        font-weight: 800;
        font-size: 1.2rem;
        color: #fff;

        em {
          font-style: normal;
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      }

      .marca-coluna p {
        margin: 0.75rem 0 0;
        font-size: 0.88rem;
        line-height: 1.6;
        color: #94a3b8;
        max-width: 34ch;
      }

      .coluna {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;

        h4 {
          margin: 0 0 0.35rem;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #e2e8f0;
        }

        a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.88rem;
          transition: color 0.15s ease;

          &:hover {
            color: #fff;
          }
        }
      }

      .footer-base {
        border-top: 1px solid rgba(148, 163, 184, 0.15);
        padding: 1.25rem 1.5rem;
        text-align: center;
        font-size: 0.8rem;
        color: #64748b;
      }

      @media (max-width: 720px) {
        .footer-inner {
          grid-template-columns: 1fr;
          gap: 1.75rem;
        }
      }
    `,
  ],
})
export class FooterComponent {
  ano = new Date().getFullYear();
}
