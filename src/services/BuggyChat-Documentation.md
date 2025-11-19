# Documentação do BuggyChat

## Visão Geral

O BuggyChat é um assistente de tutoria com IA integrado ao DebugMe que atua em duas funções principais: **Tutor de Programação** e **Consultor de Carreira**. Este documento explica a implementação técnica, focando na integração com LangChain JS, construção dinâmica de prompts e boas práticas de engenharia de prompts.

---

## Índice

1. [Integração com LangChain JS](#integração-com-langchain-js)
2. [Construção Dinâmica de Prompts](#construção-dinâmica-de-prompts)
3. [Boas Práticas de Prompt Engineering](#boas-práticas-de-prompt-engineering)

---

## Integração com LangChain JS

### O que é LangChain?

O BuggyChat usa **LangChain JS** (`@langchain/openai` e `@langchain/core`) para se comunicar com os modelos GPT da OpenAI. O LangChain simplifica o trabalho com LLMs, facilitando o gerenciamento de conversas e a integração com diferentes provedores de IA.

### Componentes Principais

#### 1. Inicialização do Chatbot

A classe `ChatOpenAI` é usada para inicializar o chatbot:

```typescript
import { ChatOpenAI } from '@langchain/openai';

export function initializeChatbot() {
  const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured...');
  }

  return new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
    openAIApiKey: apiKey,
  });
}
```

**Configuração:**
- **Modelo**: `gpt-4o-mini` - Modelo econômico e rápido, ideal para tutoria
- **Temperature**: `0.7` - Equilibra criatividade e consistência
- **API Key**: Carregada de variáveis de ambiente

#### 2. Tipos de Mensagem

O LangChain fornece classes estruturadas para diferentes tipos de mensagem:

```typescript
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
```

- **`SystemMessage`**: Contém o prompt do sistema que define o comportamento da IA
- **`HumanMessage`**: Representa as mensagens do usuário
- **`AIMessage`**: Representa as respostas da IA (usado no histórico)

#### 3. Construção do Array de Mensagens

As mensagens são montadas em uma ordem específica:

```typescript
const messages = [
  new SystemMessage(systemPrompt),           // 1. Prompt do sistema (sempre primeiro)
  ...conversationHistory.map(msg => {         // 2. Histórico da conversa
    if (msg.role === 'user') {
      return new HumanMessage(msg.content);
    } else {
      return new AIMessage(msg.content);
    }
  }),
  new HumanMessage(message),                 // 3. Mensagem atual do usuário (última)
];
```

**Por que essa ordem importa:**
- O prompt do sistema precisa vir primeiro para estabelecer o contexto
- O histórico mantém o contexto entre múltiplas interações
- A mensagem atual fica por último, sendo o foco imediato do modelo

#### 4. Invocando o Modelo

```typescript
const response = await chatModel.invoke(messages);
return response.content as string;
```

O método `invoke()` envia o array de mensagens para a OpenAI e retorna a resposta gerada.

### Vantagens do LangChain

- **Abstração**: Simplifica a interação com APIs de LLM
- **Type Safety**: Suporte TypeScript para tipos de mensagem
- **Extensibilidade**: Fácil trocar modelos ou adicionar recursos
- **Padronização**: Interface consistente entre diferentes provedores

---

## Construção Dinâmica de Prompts

O prompt do sistema é **gerado dinamicamente** para cada conversa, garantindo que a IA tenha o contexto mais relevante sobre o progresso e perfil do usuário.

### Arquitetura

A construção do prompt segue uma abordagem modular:

```
createSystemPrompt()
    ├── buildLessonContext()      → Lições completadas pelo usuário
    ├── buildCareerContext()       → Perfil de carreira (se existir)
    └── Seções de dados estáticos  → Competências, carreiras, riscos de automação
```

### 1. Contexto de Lições

A função `buildLessonContext()` extrai informações das lições que o usuário completou:

```typescript
function buildLessonContext(completedLessonIds: string[]): string {
  const completedLessons = lessons.filter(lesson => 
    completedLessonIds.includes(lesson.id)
  );

  if (completedLessons.length === 0) {
    return 'O usuário ainda não completou nenhuma lição.';
  }

  // Formata o contexto com título, tópico, dificuldade, explicação e exemplos
  return context;
}
```

**Características:**
- Inclui apenas lições realmente completadas
- Fornece conteúdo completo (título, tópico, explicação, exemplos)
- Permite que a IA referencie lições específicas nas respostas

### 2. Contexto de Carreira

A função `buildCareerContext()` cria um contexto personalizado baseado no perfil do usuário:

```typescript
function buildCareerContext(profile: Profile | null | undefined): string {
  if (!profile) {
    return '';
  }

  // Calcula scores de compatibilidade com carreiras
  const careerScores = defaultCareers.map(career => ({
    name: career.name,
    score: career.calculateCompatibilityScore(profile.competencies),
  })).sort((a, b) => b.score - a.score);

  // Monta contexto com níveis de competência, scores e habilidades a melhorar
  return context;
}
```

**Características:**
- Só inclui contexto se o perfil existir
- Pré-calcula scores de compatibilidade usando o mesmo algoritmo da UI
- Identifica habilidades abaixo do nível 3 que precisam melhorar
- Ordena carreiras por score de compatibilidade

### 3. Montagem do Prompt Final

A função `createSystemPrompt()` combina todos os contextos:

```typescript
function createSystemPrompt(
  completedLessonIds: string[], 
  profile: Profile | null | undefined
): string {
  const lessonContext = buildLessonContext(completedLessonIds);
  const careerContext = buildCareerContext(profile);
  
  // Monta seções de dados estáticos (competências, carreiras, etc.)
  
  return `Você é o BuggyChat, um tutor de IA amigável...
    ${lessonContext}${careerContext}
    === DADOS DISPONÍVEIS ===
    ...
  `;
}
```

**Estrutura do Prompt (nessa ordem):**

1. **Definição de Papel** - Estabelece a identidade do BuggyChat e seus dois papéis
2. **Papel 1: Tutor de Programação** - Instruções para ensinar programação
3. **Papel 2: Consultor de Carreira** - Instruções para orientação de carreira
4. **Contexto Dinâmico de Lições** - Lições completadas pelo usuário
5. **Contexto Dinâmico de Carreira** - Perfil e scores de compatibilidade
6. **Dados Disponíveis** - Dados de referência estáticos
7. **Instruções Gerais** - Diretrizes para responder perguntas

### Por que Reconstruir o Prompt?

O prompt é **reconstruído a cada mensagem** para garantir:

- ✅ **Contexto Atualizado**: Sempre reflete o progresso atual do usuário
- ✅ **Relevância**: Inclui apenas lições completadas e perfis ativos
- ✅ **Eficiência**: Omite dados desnecessários
- ✅ **Personalização**: Respostas adaptadas ao estado real do usuário

---

## Boas Práticas de Prompt Engineering

O prompt do BuggyChat segue várias boas práticas que garantem respostas confiáveis e contextualmente apropriadas.

### 1. Definição Clara de Papel

Defina explicitamente a identidade e propósito do assistente:

```
Você é o BuggyChat, um tutor de IA amigável para o DebugMe. Você tem DOIS papéis principais:

=== PAPEL 1: TUTOR DE PROGRAMAÇÃO ===
1. Responder perguntas sobre as lições de programação...
2. Ensinar novos conceitos de programação...
```

**Por que funciona:** Estabelece expectativas claras, previne confusão de papéis e define o tom de comunicação.

### 2. Instruções Estruturadas

Use cabeçalhos claros e listas numeradas para organizar instruções complexas:

```
=== PAPEL 1: TUTOR DE PROGRAMAÇÃO ===
1. Responder perguntas sobre as lições...
2. Ensinar novos conceitos...

=== PAPEL 2: CONSULTOR DE CARREIRA ===
1. **Recomendações de Carreira**: Use o algoritmo de scoring...
2. **Upskilling**: Identifique habilidades abaixo do nível 3...
```

**Por que funciona:** LLMs processam melhor informações estruturadas do que parágrafos longos.

### 3. Injeção de Contexto no Lugar Certo

Coloque o contexto dinâmico após a definição de papel, mas antes das instruções:

1. Definição de Papel (estático)
2. Instruções para Papel 1 (estático)
3. Instruções para Papel 2 (estático)
4. [DINÂMICO] Contexto de Lições
5. [DINÂMICO] Contexto de Carreira
6. Dados Disponíveis (referência estática)
7. Instruções Finais (estático)

### 4. Especificação de Algoritmos

Quando a IA precisa fazer cálculos, forneça o algoritmo exato:

```
1. **Recomendações de Carreira**: Use o algoritmo de scoring (mesmo da career-view):
   - Para cada carreira, calcule: sum((competency_level / 5) * weight) / sum(weights) * 100
   - Recomende carreiras com maiores scores
```

**Por que funciona:** Garante consistência com os cálculos da UI e permite transparência.

### 5. Detecção de Intenção

Instrua explicitamente a IA sobre como detectar a intenção do usuário:

```
Você detecta automaticamente quando usuários fazem perguntas sobre carreira baseado em palavras-chave como:
carreira, emprego, entrevista, automação, upskill, desenvolvimento de habilidades, etc.

Ao responder:
- Se relacionado a programação: Use contexto de lições e forneça exemplos de código (JavaScript por padrão)
- Se relacionado a carreira: Use contexto de perfil se disponível, senão forneça orientação geral
```

### 6. Divulgação Progressiva

Comece com informações de alto nível, forneça detalhes quando solicitado:

```
5. **Análise de Risco de Automação**: 
   - Forneça visão GERAL primeiro: nível de risco, porcentagem e explicação geral
   - Quando o usuário pedir mais detalhes, forneça breakdown DETALHADO:
     * Análise tarefa por tarefa
     * Estratégias de adaptação
     * Sugestões de pivot de carreira
```

**Por que funciona:** Previne sobrecarga de informação e permite que o usuário controle o nível de detalhe.

### 7. Tratamento Condicional de Contexto

Lide explicitamente com casos onde o contexto pode estar faltando:

```
Ao responder perguntas:
- Quando o perfil existe: Forneça recomendações personalizadas baseadas nas competências
- Quando o perfil não existe: Ainda responda perguntas de carreira, mas mencione que podem criar um perfil para conselhos personalizados
```

**Por que funciona:** Previne erros, fornece degradação graciosa e mantém funcionalidade mesmo sem contexto completo.

### 8. Formatação e Tom

Especifique o formato de saída e o tom desejado:

```
- Use formatação markdown para melhor legibilidade
- Mantenha explicações claras e bem estruturadas
- Forneça exemplos de código (JavaScript por padrão)
- Seja encorajador, solidário e acionável
```

---

## Resumo

O BuggyChat é um assistente de IA bem arquitetado que:

1. **Usa LangChain JS** para interação padronizada com LLMs e gerenciamento de mensagens
2. **Constrói prompts dinamicamente** baseado no progresso e perfil do usuário
3. **Segue boas práticas de prompt engineering** incluindo definição clara de papéis, instruções estruturadas e injeção de contexto

O resultado é um tutor responsivo e contextualmente consciente que se adapta à jornada de aprendizado e objetivos de carreira de cada usuário.

---

## Localização dos Arquivos

- **Implementação Principal**: `src/services/chatbot.ts`
- **Dados de Carreira**: `src/services/career-data.ts`
- **Dados de Lições**: `src/components/lessons-view.tsx`
- **Componente UI**: `src/components/chatbot-widget.tsx`
