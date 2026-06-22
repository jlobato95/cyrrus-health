# Cyrrus Health - Carteira Digital de Vacinação Infantil

O **Cyrrus Health** é uma plataforma focada no acompanhamento da saúde infantil, fornecendo uma solução digital e inteligente para substituir a tradicional carteira física de vacinação. Este projeto foi desenvolvido como parte de um desafio técnico voltado à avaliação de arquitetura, qualidade de código, boas práticas e experiência de usuário (UX).

---

## 🚀 Visão Geral do Projeto

A plataforma permite que pais e responsáveis gerenciem a jornada de vacinação de múltiplos dependentes de forma isolada e descomplicada.

### Cenários de Negócio Atendidos:
- **Fluxo Regular:** Visualização clara das vacinas já aplicadas e pendentes por faixa etária.
- **Alerta de Atraso:** Destaque visual imediato para vacinas cuja data prevista de aplicação já foi ultrapassada.
- **Campanhas Ativas:** Exibição de campanhas de vacinação ativas para as quais o público infantil selecionado é elegível.
- **Gestão Familiar (Multi-dependentes):** Isolamento total dos dados de cada criança da família, evitando confusões de históricos.

---

## 🎨 Interface & Design System

A interface foi projetada para ser responsiva (Desktop, Tablet e Mobile) e segue a paleta de cores institucional obrigatória:

| Cor | Hex | Aplicação no Sistema |
|---|---|---|
| **Verde Oliva Claro** | `#ABC270` | Sucesso, Vacinas Aplicadas e Elementos de Saúde |
| **Amarelo Claro** | `#FEC868` | Atenção e Alertas de Proximidade |
| **Laranja Suave** | `#FDA769` | Pendências, Destaques e Vacinas Atrasadas |
| **Marrom Escuro** | `#473C33` | Textos, Títulos e Elementos Neutros Estruturais |

A estilização foi feita utilizando **SCSS** de forma centralizada e aproveitando componentes nativos do **Ionic Framework** para garantir uma excelente experiência mobile-first e fidelidade de comportamento tátil.

---

## 🏗️ Arquitetura e Decisões de Design

A aplicação segue uma estrutura modular focada em escalabilidade e legibilidade de código:

```text
src/app/
├── components/         # Componentes reutilizáveis (ChildCard, VaccineCard)
├── config/             # Configurações globais e chaves de armazenamento
├── home/               # Página inicial / Landing do app
├── pages/              # Páginas da aplicação (Dashboard, Family, Timeline, Campaigns)
├── services/           # Serviços globais de dados e utilitários
├── app.routes.ts       # Configurações de rotas modularizadas
└── app.component.ts    # Componente raiz da aplicação
```

### Principais Práticas do Angular Moderno Aplicadas:
- **Signals:** Gerenciamento de estado reativo e eficiente para a seleção de dependentes e atualização instantânea de painéis.
- **Função `inject()`:** Injeção de dependências limpa, direta na lógica de inicialização de componentes e serviços, eliminando construtores inflados.
- **Componentes Standalone:** Modularidade máxima, facilitando testes e eliminando a necessidade de grandes módulos declarativos.
- **Centralização:** 
  - Chamadas de API e manipulações de regras de negócios centralizadas em `VaccineService`.
  - Tratamento centralizado de erros e mensagens ao usuário em `AlertService`.
  - Manipulação de persistência local (Storage) sob a responsabilidade única de `StorageService` utilizando chaves padronizadas em `storage-keys.config.ts`.
- **Roteamento Limpo:** Configurado de forma desacoplada para suportar lazy loading automático de páginas secundárias.

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter o **Node.js** e o **Angular CLI** instalado em sua máquina.

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/jlobato95/cyrrus-health.git
cd cyrrus-health
```

### Passo 2: Instalar as Dependências
```bash
npm install
```

### Passo 3: Executar o Servidor de Desenvolvimento
```bash
npm start
```
Acesse a aplicação no navegador através do endereço `http://localhost:4200`.

---

## 🌐 Hospedagem & Deploy na Vercel

O projeto está configurado para ser publicado de forma contínua e integrada à plataforma **Vercel** através do arquivo `vercel.json` na raiz do projeto.

### Configuração de Build no Painel da Vercel:
Ao importar este repositório na Vercel, utilize os seguintes parâmetros (que já estão pré-configurados e serão detectados automaticamente):

- **Build Command:** `npm run build` (ou `ng build`)
- **Output Directory:** `www` (definido no `angular.json` do projeto para compilação Ionic Angular)
- **Framework Preset:** Angular

O roteamento da aplicação está configurado no arquivo `vercel.json` para realizar o redirecionamento (*rewrites*) de todas as URLs não-estáticas para o `index.html`. Isso garante que o roteamento interno do Angular (SPA) funcione perfeitamente ao recarregar a página em qualquer rota específica (como `/dashboard` ou `/family`), evitando o erro `404 - Not Found`.
