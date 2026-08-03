# Gaming Zone — Angular

Versão migrada do projeto original (HTML + CSS + JS + Bootstrap) para **Angular 21 + Bootstrap 5 + jQuery**, com um painel administrativo para gerenciar o catálogo de produtos via API (JSON-Server).

## Pré-requisitos

- Node.js 20 LTS ou superior (o projeto foi gerado com Node 22)
- npm 10+ (vem junto com o Node)
- Angular CLI instalada globalmente: `npm install -g @angular/cli`

## Instalação

```bash
cd gaming-zone-angular
npm install
```

Isso instala Angular, Bootstrap, jQuery, o `json-server` (usado como API local) e os tipos do jQuery — tudo já está listado no `package.json`, não precisa instalar nada manualmente além disso.

## ⚠️ Antes de rodar: coloque as imagens

A pasta `img/` do projeto original estava vazia, então as imagens não vieram no pacote. Copie os arquivos originais (mesmos nomes) para:

```
public/assets/img/
├── logo.png
├── banner1.PNG
├── banner2.PNG
├── banner3.PNG
├── jogo1.PNG
├── jogo2.PNG
└── jogo3.PNG
```

Tudo que está dentro de `public/` é copiado como está para a raiz do build (é a pasta oficial de assets estáticos do Angular CLI atual). Por isso os componentes referenciam os caminhos como `assets/img/logo.png`.

## Rodando em desenvolvimento

O catálogo de produtos agora vem de uma API local (`json-server`), então é preciso rodar **dois processos em paralelo**, cada um em um terminal:

```bash
# Terminal 1 — API (lê e escreve em db.json)
npm run api
```

```bash
# Terminal 2 — aplicação Angular
npm start
```

A API sobe em `http://localhost:3000` (endpoint principal: `http://localhost:3000/produtos`) e a aplicação em `http://localhost:4200`. Se quiser manter a mesma porta do projeto original:

```bash
ng serve --port 5500
```

## Build de produção

```bash
npm run build
```

Gera os arquivos finais em `dist/gaming-zone-angular/browser`. É esse conteúdo que você sobe para qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, um servidor Nginx, etc.).

> Como o catálogo depende do `json-server` rodando em `localhost:3000`, um deploy estático (sem back-end) só vai funcionar de fato se a API também estiver publicada em algum lugar acessível — ou se o `apiUrl` do `ProductService` for apontado para essa API publicada.

## Painel Administrativo (Painel Principal + Cadastro)

Além da vitrine pública, o projeto tem duas telas para gerenciar o catálogo:

| Rota | Componente | Função |
| --- | --- | --- |
| `/painel-principal` | `PainelPrincipal` | Lista todos os produtos cadastrados na API, com opções de editar e excluir |
| `/cadastro-produto` | `CadastroProduto` | Formulário para cadastrar um novo produto |
| `/cadastro-produto/:id` | `CadastroProduto` | Mesmo formulário, mas pré-preenchido para editar um produto existente |

Essas telas usam o `ProductService` (`src/app/core/services/product.ts`), que faz as requisições HTTP para o `json-server`:

- `GET /produtos` — lista os produtos (`carregarProdutos()`)
- `GET /produtos/:id` — busca um produto específico (`obterProdutoPorId()`)
- `POST /produtos` — cadastra um novo produto (`adicionarProduto()`)
- `PUT /produtos/:id` — atualiza um produto existente (`atualizarProduto()`)
- `DELETE /produtos/:id` — remove um produto (`deletarProduto()`)

Os dados ficam persistidos no arquivo `db.json`, na raiz do projeto (é o "banco de dados" do `json-server`).

## O que mudou em relação ao projeto original

| Original | Angular |
| --- | --- |
| `index.html` (tudo em um arquivo) | `pages/home` + 5 componentes de seção (`hero`, `trust-band`, `products`, `about`, `contact`) |
| `login.html` | `pages/login` |
| — | `pages/painel-principal` e `pages/cadastro-produto` (novo painel administrativo, consumindo API) |
| `js/app.js` (funções soltas + manipulação de DOM) | `core/services` (`ProductService`, `CartService`, `AuthService`) + lógica dentro de cada componente |
| Filtro/busca de produtos via `querySelectorAll` | `Signal` + `computed()` no `ProductService` |
| Catálogo de produtos fixo no código | Catálogo vindo de uma API (`json-server` + `HttpClient`), com CRUD completo |
| Cadastro/login com `localStorage` | Mesma ideia, encapsulada no `AuthService` |
| Validação HTML5 (`checkValidity`) | Angular Reactive Forms (`FormGroup`, `Validators`) — login/cadastro de usuário; formulário de produto usa Template-driven Forms (`ngModel`) |
| CSS em `css/style.css` | Copiado para `src/styles.css` (estilos globais, sem alterações) — mantém 100% a aparência original |
| Bootstrap e jQuery via `<script>` no HTML (CDN) | Instalados via npm e referenciados no `angular.json` (`styles`/`scripts`) |

## Onde entra o jQuery

O `HeaderComponent` (`src/app/layout/header/header.ts`) usa jQuery para fechar o menu mobile (navbar colapsada) ao clicar em um link — o mesmo comportamento do `app.js` original. O resto da interatividade (filtros, carrinho, formulários, login, painel administrativo) foi migrado para o "jeito Angular" (signals, forms), que é mais robusto e testável — mas o jQuery continua disponível globalmente (`window.$`) para qualquer novo uso que você precisar.

## Estrutura de pastas

```
gaming-zone-angular/
├── db.json                 # "banco de dados" do json-server (coleção "produtos")
├── src/app/
│   ├── core/
│   │   ├── models/          # Product, User (interfaces TypeScript)
│   │   ├── services/         # ProductService (HTTP + signals), CartService, AuthService
│   │   └── validators/        # validador de confirmação de senha
│   ├── layout/
│   │   ├── header/           # navbar, usada em Home, Painel Principal e Cadastro
│   │   └── footer/
│   ├── pages/
│   │   ├── home/
│   │   │   ├── home.ts        # monta as seções
│   │   │   └── sections/
│   │   │       ├── hero/
│   │   │       ├── trust-band/
│   │   │       ├── products/
│   │   │       ├── about/
│   │   │       └── contact/
│   │   ├── login/
│   │   ├── painel-principal/  # lista de produtos (admin), com editar/excluir
│   │   └── cadastro-produto/  # formulário de cadastro/edição de produto
│   ├── app.routes.ts          # rotas: "", "login", "painel-principal", "cadastro-produto"[/:id]
│   ├── app.config.ts          # providers: router, HttpClient
│   └── app.ts                 # componente raiz (só o <router-outlet>)
```
