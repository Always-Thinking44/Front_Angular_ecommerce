# Ecommerce Frontend

Aplicação de comércio eletrónico desenvolvida com Angular 21. Interface de loja com catálogo de produtos, carrinho, checkout, área de cliente e painel de administração.

## Requisitos

- Node.js 20 ou superior
- npm 11 ou superior
- Angular CLI 21

## Instalação

```bash
npm install
```

## Desenvolvimento

Iniciar o servidor local:

```bash
npm start
```

A aplicação fica disponível em `http://localhost:4200/` e recarrega automaticamente ao alterar os ficheiros.

## Build

```bash
npm run build
```

Os artefactos são gerados na pasta `dist/`. Por predefinição a build de produção otimiza a aplicação para desempenho.

Para build em modo desenvolvimento com watch:

```bash
npm run watch
```

## Testes

```bash
npm test
```

Os testes unitários usam o runner Vitest.

## Estrutura do projeto

```
src/
  app/
    core/          Serviços, modelos, guards e interceptors
    features/      Módulos funcionais da aplicação
    shared/        Componentes reutilizáveis
  environments/    Configuração de ambiente
  styles.scss      Estilos globais
```

### Funcionalidades

- Loja: lista de produtos, filtros e página de detalhe
- Carrinho: gestão de itens e quantidades
- Checkout: finalização de encomendas
- Conta: perfil e histórico de encomendas
- Autenticação: login e registo
- Administração: gestão de produtos, categorias e encomendas

## Rotas principais

| Rota | Descrição |
| --- | --- |
| `/` | Página inicial |
| `/loja` | Lista de produtos |
| `/loja/:id` | Detalhe do produto |
| `/carrinho` | Carrinho (requer login) |
| `/checkout` | Finalização (requer login) |
| `/conta/perfil` | Perfil do utilizador |
| `/conta/historico` | Histórico de encomendas |
| `/admin/produtos` | Gestão de produtos (admin) |
| `/admin/categorias` | Gestão de categorias (admin) |
| `/admin/encomendas` | Gestão de encomendas (admin) |

## Configuração

O URL da API é definido em `src/environments/environment.ts`:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://api-ecommerce-laravel.onrender.com/api'
};
```

## Tecnologias

- Angular 21
- TypeScript 5.9
- RxJS 7.8
- SCSS
- Vitest
- Prettier

## Scaffolding

Gerar um novo componente:

```bash
ng generate component nome-do-componente
```

Lista completa de schematics disponíveis:

```bash
ng generate --help
```
