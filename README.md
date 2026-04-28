# ⚡ React Flow Canvas Editor

Editor de canvas baseado em nós, construído com [React Flow](https://reactflow.dev/), projetado como um motor reutilizável e composável para fluxos de trabalho com diagramas e quadros interativos.

> Demo ao vivo: [react-flow-pedrovo.vercel.app](https://react-flow-pedrovo.vercel.app) *(atualize com a sua URL)*

---

## ✨ Funcionalidades

- **Auto-Spawn estilo Miro** — Passe o mouse sobre um nó para exibir os botões `+` direcionais. Clique para criar instantaneamente um nó conectado naquela direção.
- **Espaçamento Inteligente** — Múltiplos nós criados pelo mesmo lado são distribuídos automaticamente para evitar sobreposição.
- **Edição Inline** — Clique duplo ou use a barra de ferramentas para editar os rótulos dos nós diretamente no canvas.
- **Operações CRUD** — Crie, edite e exclua nós com suporte completo a teclado (`Enter` para salvar, `Esc` para cancelar).
- **Composition Pattern** — Construído com componentes compostos e um hook customizado, facilitando o reuso em qualquer contexto.

---

## 🏗️ Arquitetura

O projeto segue estritamente o **Composition Pattern**, separando responsabilidades em módulos pequenos e focados.

```
components/flow/
├── index.tsx              # Namespace Flow (Root, Canvas, useFlowState)
├── use-flow-state.ts      # Hook principal: lógica de CRUD + Auto-Spawn
├── inline-edit.tsx        # Componente composto para edição inline
└── node/
    ├── index.tsx          # Orquestrador do FlowNode
    ├── context.tsx        # NodeContext compartilhado entre sub-componentes
    ├── toolbar.tsx        # Ações de editar / excluir
    ├── quick-actions.tsx  # Botões de spawn direcionais
    ├── ghost-preview.tsx  # Prévia visual ao passar o mouse
    └── content.tsx        # Wrapper do InlineEdit
```

### Como o namespace `Flow` é consumido

```tsx
// app/page.tsx
const { nodes, edges, onNodesChange, addNode, editNode, deleteNode, autoSpawn } =
  Flow.useFlowState<CustomNodeData>();

return (
  <Flow.Root>
    <Flow.Canvas nodes={enrichedNodes} edges={edges} ...>
      <Flow.Background />
      <Flow.Controls />
    </Flow.Canvas>
  </Flow.Root>
);
```

---

## 🚀 Como Rodar

### Pré-requisitos

- Node.js `>= 18`
- pnpm `>= 10`

### Instalação

```bash
pnpm install
```

### Desenvolvimento

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🧪 Testes

Os testes são isolados por operação e seguem a convenção `data-testid` para seletores resilientes.

```bash
# Rodar uma vez
pnpm test

# Modo watch
pnpm test:watch
```

| Teste | Descrição |
|---|---|
| Deve criar um novo nó | Valida que o botão Adicionar cria um nó em modo de edição |
| Deve atualizar o rótulo | Valida que a edição inline salva o rótulo corretamente |
| Deve remover o nó | Valida que o botão de excluir na toolbar remove o nó |
| Deve criar nó conectado | Valida que o Auto-Spawn cria um segundo nó linkado |

---

## 🔍 Verificação de Tipos

```bash
pnpm typecheck
```

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Engine de Canvas | @xyflow/react v12 |
| Estilização | Tailwind CSS v4 |
| Testes | Jest + @testing-library/react v16 |
| Linguagem | TypeScript 5 |
| Gerenciador de Pacotes | pnpm |

---

## 📐 Decisões de Design

### `useFlowState` como fonte única da verdade
Toda a lógica de negócio (CRUD, Auto-Spawn, cálculo de posição) vive dentro do `useFlowState`. As páginas são puramente declarativas — apenas consomem o hook e renderizam.

### Object Literals no lugar de if/else
A lógica direcional (mapeamento de posição e de handles) utiliza lookups em objetos ao invés de cadeias condicionais, tornando o código mais fácil de estender.

### Convenção `data-testid`
Todos os elementos interativos possuem um atributo `data-testid`. Os testes nunca dependem de conteúdo textual ou seletores CSS, o que os torna resilientes a mudanças de design e internacionalização.

---

## 📁 Estrutura do Projeto

```
.
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── flow/           # Motor do canvas (reutilizável)
├── __tests__/
│   └── crud-node.test.tsx
├── jest.config.ts
├── jest.setup.ts
└── package.json
```

---

## 📄 Licença

MIT
