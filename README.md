# DebugMe - Aplicativo Educacional de Jogo de Programação

**DebugMe** é uma aplicação web interativa e gamificada projetada para ensinar programação através de aventura e exploração. O aplicativo combina trilhas de aprendizado estruturadas, desafios práticos de programação, orientação de carreira e um chatbot tutor alimentado por IA para criar uma experiência de aprendizado abrangente.

O design original está disponível em [Figma](https://www.figma.com/design/V787j6as39BywMlgrzuaEr/Educational-Coding-Game-App).

## 🎯 Visão Geral

O DebugMe transforma o aprendizado de programação em uma experiência envolvente semelhante a um jogo. Os usuários progridem através de níveis completando lições e desafios, ganhando XP, desbloqueando conquistas e recebendo orientação de carreira personalizada com base em suas habilidades e interesses.

## ✨ Funcionalidades

### 📊 Painel de Progresso
- **Sistema de Níveis**: Progrida através de níveis ganhando XP de atividades completadas
- **Rastreamento de XP**: Barras de progresso visuais mostrando XP ganho e necessário para o próximo nível
- **Contador de Sequência**: Acompanhe sequências diárias de aprendizado para manter a motivação
- **Cartas de Personagem**: Representação visual da sua jornada de aprendizado
- **Estatísticas Rápidas**: Visão geral de lições completadas, desafios resolvidos, emblemas conquistados e classificação atual

### 📚 Lições Interativas
- **Trilha de Aprendizado Estruturada**: Lições progressivas cobrindo conceitos fundamentais de programação
- **Tópicos Abordados**: Variáveis, Funções, Condicionais, Loops, Arrays e mais
- **Níveis de Dificuldade**: Lições para Iniciantes, Intermediárias e Avançadas
- **Conteúdo Inclui**:
  - Explicações claras de conceitos de programação
  - Exemplos de código com destaque de sintaxe
  - Questionários interativos para testar compreensão
  - Recompensas de XP por conclusão
- **Bloqueio por Nível**: Lições são desbloqueadas conforme você progride, mantendo uma curva de dificuldade apropriada

### 🏆 Desafios de Programação
- **Prática Prática**: Desafios reais de programação com código inicial e casos de teste
- **Múltiplas Dificuldades**: Desafios Fáceis, Médios e Difíceis
- **Recursos**:
  - Descrições de problemas e requisitos
  - Modelos de código inicial
  - Casos de teste para validar soluções
  - Dicas para orientação
  - Explicações de soluções
- **Tópicos**: Funções, Condicionais, Arrays e Loops, Strings, Problemas de Lógica (incluindo o clássico FizzBuzz)

### 💼 Orientação de Carreira
- **Criação de Perfil**: Crie perfis personalizados avaliando suas habilidades (escala de 1-5) em 10 competências:
  - Técnicas: Lógica de Programação, Pensamento Analítico, Inteligência Artificial
  - Comportamentais: Criatividade, Colaboração, Adaptabilidade, Comunicação, Resolução de Problemas, Curiosidade, Liderança
- **Compatibilidade de Carreira**: Obtenha pontuações de compatibilidade para 6 carreiras em tecnologia:
  - Cientista de Dados
  - Engenheiro de Software
  - Designer UX
  - Especialista em Cibersegurança
  - Engenheiro de Machine Learning
  - Empreendedor em Tecnologia
- **Recomendações de Trilha de Aprendizado**: Sugestões personalizadas para melhoria de habilidades
- **Análise de Risco de Automação**: Entenda os riscos de automação para diferentes carreiras com:
  - Avaliação de nível de risco (baixo/médio/alto)
  - Análise tarefa por tarefa
  - Estratégias de adaptação
  - Habilidades complementares para desenvolver

### 🤖 Chatbot Alimentado por IA (BuggyChat)
- **Assistente de Dupla Função**: 
  - **Tutor de Programação**: Responde perguntas sobre lições completadas, ensina novos conceitos, fornece exemplos de código
  - **Consultor de Carreira**: Fornece orientação sobre trilhas de carreira, aprimoramento de habilidades, requalificação, entrevistas de emprego e risco de automação
- **Consciente do Contexto**: Usa suas lições completadas e perfil de carreira para fornecer respostas personalizadas
- **Recursos**:
  - Suporte a Markdown com destaque de sintaxe
  - Histórico de conversas
  - Funcionalidade de limpar chat
  - Design responsivo com rolagem suave

### 👤 Perfil e Conquistas
- **Estatísticas Abrangentes**: Acompanhe XP total, nível atual, lições/desafios completados, sequências e emblemas
- **Sistema de Emblemas**: Ganhe emblemas por marcos:
  - Primeiros Passos: Complete sua primeira lição
  - Sequência de Aprendizado: Complete 5 lições
  - Mestre de Desafios: Complete 3 desafios
  - Estrela em Ascensão: Alcance o Nível 5
  - Perfeccionista: Obtenha 100% em qualquer questionário
  - Aprendiz Dedicado: Mantenha uma sequência de 7 dias
- **Visualização de Progresso**: Barras de progresso visuais e exibições de conquistas

## 🛠️ Stack Tecnológico

- **Framework Frontend**: React 18.3 com TypeScript
- **Ferramenta de Build**: Vite 6.3
- **Estilização**: Tailwind CSS
- **Componentes UI**: Radix UI (biblioteca abrangente de componentes)
- **Integração de IA**: LangChain com OpenAI (GPT-4o-mini)
- **Destaque de Código**: react-syntax-highlighter
- **Renderização de Markdown**: react-markdown
- **Gráficos**: Recharts
- **Ícones**: Lucide React

## 📋 Pré-requisitos

Antes de configurar o projeto, certifique-se de ter:

- **Node.js** (versão 18 ou superior recomendada)
- **npm** (vem com Node.js)
- **Chave de API OpenAI** (para funcionalidade do chatbot)

## 🚀 Instruções de Configuração Local

### 1. Clonar o Repositório

```bash
git clone <repository-url>
cd debug-me
```

### 2. Instalar Dependências

```bash
npm install
```

Isso instalará todas as dependências necessárias, incluindo React, Vite, Tailwind CSS, componentes Radix UI, LangChain e outros pacotes.

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` no diretório raiz:

```bash
touch .env
```

Adicione sua chave de API OpenAI ao arquivo `.env`:

```env
VITE_OPENAI_API_KEY=sua_chave_api_openai_aqui
```

**Nota**: A funcionalidade do chatbot requer uma chave de API OpenAI válida. Sem ela, o chatbot não funcionará. Você pode obter uma chave de API no [site da OpenAI](https://platform.openai.com/api-keys).

### 4. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor de desenvolvimento será iniciado em `http://localhost:3000` (conforme configurado em `vite.config.ts`). O navegador deve abrir automaticamente para a aplicação.

### 5. Build para Produção

Para criar um build de produção:

```bash
npm run build
```

Os arquivos compilados estarão no diretório `build/`.

## 📁 Estrutura do Projeto

```
debug-me/
├── public/              # Assets estáticos (imagens, etc.)
├── src/
│   ├── components/      # Componentes React
│   │   ├── ui/         # Componentes UI reutilizáveis (baseados em Radix UI)
│   │   ├── career-view.tsx
│   │   ├── challenges-view.tsx
│   │   ├── chatbot-widget.tsx
│   │   ├── lessons-view.tsx
│   │   ├── profile-view.tsx
│   │   └── progress-dashboard.tsx
│   ├── services/        # Lógica de negócios e serviços de API
│   │   ├── career-data.ts
│   │   └── chatbot.ts
│   ├── styles/          # Estilos globais
│   ├── App.tsx          # Componente principal da aplicação
│   └── main.tsx         # Ponto de entrada da aplicação
├── index.html           # Template HTML
├── package.json         # Dependências e scripts
├── vite.config.ts       # Configuração do Vite
└── README.md            # Este arquivo
```

## 🎮 Como Usar

1. **Começar a Aprender**: Navegue até a aba "Lições" e comece com lições de nível iniciante
2. **Completar Desafios**: Teste suas habilidades na aba "Desafios"
3. **Acompanhar Progresso**: Monitore seu XP, nível e conquistas no "Painel"
4. **Obter Orientação de Carreira**: Crie um perfil na aba "Carreira" para receber recomendações personalizadas
5. **Fazer Perguntas**: Use o widget BuggyChat (canto inferior direito) para obter ajuda com perguntas sobre programação ou carreira
6. **Ver Perfil**: Verifique suas conquistas e estatísticas na aba "Perfil"

## 🔧 Configuração

### Porta do Servidor de Desenvolvimento

A porta padrão é 3000. Para alterá-la, modifique `vite.config.ts`:

```typescript
server: {
  port: 3000,  // Altere para sua porta preferida
  open: true,
}
```

### Modelo OpenAI

O chatbot usa GPT-4o-mini por padrão. Para alterar o modelo, edite `src/services/chatbot.ts`:

```typescript
return new ChatOpenAI({
  modelName: 'gpt-4o-mini',  // Altere para seu modelo preferido
  temperature: 0.7,
  openAIApiKey: apiKey,
});
```

## 🐛 Solução de Problemas

### Chatbot Não Está Funcionando
- Certifique-se de que `VITE_OPENAI_API_KEY` está definida em seu arquivo `.env`
- Verifique se sua chave de API OpenAI é válida e tem créditos suficientes
- Verifique o console do navegador para mensagens de erro

### Porta Já em Uso
- Altere a porta em `vite.config.ts` ou pare o processo usando a porta 3000

### Erros de Build
- Limpe `node_modules` e reinstale: `rm -rf node_modules && npm install`
- Certifique-se de estar usando Node.js 18 ou superior

## 📝 Notas

- Todo o progresso do usuário é armazenado no estado do navegador (localStorage não implementado na versão atual)
- O chatbot requer uma conexão ativa com a internet e uma chave de API OpenAI válida
- As recomendações de carreira são baseadas no algoritmo de pontuação de compatibilidade definido no código

## 🤝 Contribuindo

Este é um projeto educacional baseado em um design do Figma. Contribuições e melhorias são bem-vindas!

## 📄 Licença

Este projeto é para fins educacionais. Por favor, consulte o design original do Figma para atribuição.

---

**Feliz Programação! 🚀**
