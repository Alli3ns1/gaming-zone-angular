# Gaming Zone — Enterprise Gaming E-Commerce & Admin Platform

Aplicação web SPA (*Single Page Application*) desenvolvida em **Angular 21** com arquitetura moderna baseada em **Standalone Components**, **Angular Signals** e controle de acesso baseado em papéis (**RBAC - Role-Based Access Control**). A solução integra uma vitrine pública de comércio eletrônico, sistema de autenticação e um painel de administração para gestão de catálogo (produtos) e carteira de clientes via API RESTful.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Versão | Descrição / Papel |
|---|---|---|---|
| **Core Framework** | Angular | 21.2 | Standalone Components, Signals, Computed State, Control Flow syntax |
| **Linguagem** | TypeScript | 5.9 | Tipagem estática rigorosa e interfaces de domínio |
| **Design & UI** | Bootstrap | 5.3 | Sistema de grid responsivo, utilitários e layout base |
| **Interatividade Mobile** | jQuery | 4.0 | Controle de colapso do menu de navegação mobile |
| **Mock API / Backend** | JSON Server | 0.17 | Mock de API RESTful com persistência síncrona em disco (`db.json`) |
| **Test Runner** | Vitest | 4.0 | Suite para testes unitários e de integração de componentes |

---

## 📐 Arquitetura do Projeto

A aplicação segue uma divisão em camadas com separação clara de responsabilidades (*Separation of Concerns*):

```
src/app/
├── core/                                # Núcleo da aplicação (regras de negócio e dados globais)
│   ├── guards/
│   │   ├── admin.guard.ts               # Guard de rotas para perfil Administrador
│   │   └── auth.guard.ts                # Guard de rotas para usuários autenticados
│   ├── models/
│   │   ├── cliente.model.ts             # Interface de domínio: Cliente
│   │   ├── product.model.ts             # Interface de domínio: Product + Union Type ProductCategory
│   │   └── user.model.ts                # Interface de domínio: User + Role ('admin' | 'client')
│   ├── services/
│   │   ├── auth.ts                      # Gestão de credenciais, sessão (sessionStorage) e signals reativos
│   │   ├── cart.ts                      # Gerenciamento de estado do carrinho de compras
│   │   ├── cliente.ts                   # Camada de integração HTTP para CRUD de clientes
│   │   └── product.ts                   # Camada de integração HTTP para CRUD e busca reativa de produtos
│   └── validators/
│       └── password-match.validator.ts  # Validador reativo para confirmação de senha
├── layout/                              # Componentes estruturais e persistentes de interface
│   ├── header/                          # Barra de navegação com renderização condicional por perfil
│   └── footer/                          # Rodapé institucional
├── pages/                               # Módulos de visualização e páginas de rota
│   ├── home/                            # Vitrine pública
│   │   └── sections/                    # Componentes das seções (hero, trust-band, products, about, contact)
│   ├── login/                           # Autenticação e cadastro de novos clientes (Reactive Forms)
│   ├── painel-principal/                # Painel de gestão de catálogo de produtos com exclusão inline
│   ├── cadastro-produto/                # Formulário de inserção e atualização de produtos (Template-driven)
│   └── clientes/                        # Painel de gestão de clientes com modal de inserção e edição
├── app.routes.ts                        # Mapeamento declarativo de rotas, títulos e guards
├── app.config.ts                        # Configuração global de providers (Router, HttpClient)
└── app.ts                               # Componente raiz de ancoragem (<router-outlet>)
```

---

## 🔒 Segurança e Controle de Acesso (RBAC)

O sistema implementa dois níveis de privilégio com proteção de rotas via `adminGuard`:

| Perfil | Identificador / Login | Senha Padrão | Escopo de Acesso |
|---|---|---|---|
| **Administrador** | `Administrador` | `admin123` | Acesso irrestrito a todas as áreas: vitrine, painel de produtos e gestão de clientes. |
| **Cliente** | *Nome informado no cadastro* | *Senha cadastrada* | Acesso à vitrine pública, visualização de catálogo e carrinho de compras. Bloqueio automático a rotas administrativas. |

---

## 🚦 Roteamento e Proteção

| Rota | Acesso | Guard | Descrição |
|---|---|---|---|
| `/` | Público | — | Página inicial, catálogo dinâmico com filtros reativos e busca. |
| `/login` | Público | — | Autenticação e formulário de novo cadastro (Nome e Senha). |
| `/painel-principal` | Restrito | `adminGuard` | Tabela administrativa de produtos com ações de edição e exclusão. |
| `/cadastro-produto` | Restrito | `adminGuard` | Formulário para cadastro de novos produtos no catálogo. |
| `/cadastro-produto/:id` | Restrito | `adminGuard` | Formulário pré-carregado para atualização de produto existente. |
| `/clientes` | Restrito | `adminGuard` | Gestão completa de clientes cadastrados (inclusão, edição, exclusão). |
| `**` | Redirecionamento | — | Redireciona rotas inexistentes para `/`. |

---

## 📡 Endpoints da API REST (`json-server`)

O servidor mock opera por padrão na porta `3000` consumindo e persistindo os dados no arquivo `db.json`.

### Recursos: `/produtos`
| Método | Endpoint | Payload / Parâmetros | Descrição |
|---|---|---|---|
| `GET` | `/produtos` | — | Retorna a listagem completa de produtos. |
| `GET` | `/produtos/:id` | `id` (inteiro) | Retorna os detalhes de um produto específico. |
| `POST` | `/produtos` | `Product` (JSON) | Cria um novo produto no catálogo. |
| `PUT` | `/produtos/:id` | `id`, `Product` (JSON) | Atualiza integralmente os dados de um produto. |
| `DELETE` | `/produtos/:id` | `id` (inteiro) | Remove o produto correspondente. |

### Recursos: `/clientes`
| Método | Endpoint | Payload / Parâmetros | Descrição |
|---|---|---|---|
| `GET` | `/clientes` | — | Retorna a listagem completa de clientes. |
| `GET` | `/clientes/:id` | `id` (inteiro) | Retorna os detalhes de um cliente. |
| `POST` | `/clientes` | `Cliente` (JSON) | Cadastra um novo cliente na base. |
| `PUT` | `/clientes/:id` | `id`, `Cliente` (JSON) | Atualiza os dados cadastrais do cliente. |
| `DELETE` | `/clientes/:id` | `id` (inteiro) | Exclui o registro do cliente. |

---

## 💻 Instalação e Execução Local

### Pré-requisitos
* **Node.js**: v20.x LTS ou v22.x
* **npm**: v10.x ou superior
* **Angular CLI**: `npm install -g @angular/cli`

### 1. Clonagem e Instalação de Dependências
```bash
git clone https://github.com/Alli3ns1/gaming-zone-angular
cd gaming-zone-angular
npm install
```

### 2. Assets Estáticos
Certifique-se de que os assets de mídia estejam presentes no diretório `public/assets/img/`:
* `logo.png`, `banner1.PNG`, `banner2.PNG`, `banner3.PNG`, `jogo1.PNG`, `jogo2.PNG`, `jogo3.PNG`.

### 3. Inicialização dos Serviços em Desenvolvimento

A execução completa exige dois terminais simultâneos:

```bash
# Terminal 1 — Servidor da API REST
npm run api
```

```bash
# Terminal 2 — Servidor de Desenvolvimento Angular (Vite HMR)
npm start
```

* **Aplicação Web:** `http://localhost:4200`
* **API REST (JSON Server):** `http://localhost:3000`

---

## 📜 Scripts npm Disponíveis

| Script | Comando | Finalidade |
|---|---|---|
| `npm start` | `ng serve` | Inicia o servidor local com Live Reload na porta 4200. |
| `npm run api` | `json-server --watch db.json --port 3000` | Inicia a API mock com persistência ativa. |
| `npm run build` | `ng build` | Compila o bundle otimizado de produção em `dist/`. |
| `npm run watch` | `ng build --watch --configuration development` | Compila em modo contínuo com geração de mapas de desenvolvimento. |
| `npm test` | `ng test` | Executa a suite de testes unitários automatizados. |
