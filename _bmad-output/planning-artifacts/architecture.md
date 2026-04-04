---
stepsCompleted: ['step-01-init', 'step-02-context', 'step-03-starter', 'step-04-decisions', 'step-05-patterns', 'step-06-structure', 'step-07-validation', 'step-08-complete']
inputDocuments: ['product-brief-App-Fono.md', 'prd.md', 'project-context.md']
workflowType: 'architecture'
project_name: 'Comunica+ Inteligente'
user_name: 'Thiago'
date: '2026-04-04'
status: 'complete'
lastStep: 8
completedAt: '2026-04-04'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
O sistema exige uma arquitetura de "Pipeline Assistivo" onde a entrada de dados (Áudio/Câmera) é processada de forma assíncrona para não bloquear a prancha de comunicação principal. A lógica de predição deve ser extensível para suportar os 7 idiomas planejados. (22 FRs identificados no PRD).

**Non-Functional Requirements:**
- **Latência Crítica**: < 200ms para predição Whisper -> UI.
- **Privacidade por Design**: Processamento em buffer circular volátil 100% local.
- **Acessibilidade Motora**: Rejeição de tremor de 300ms integrada ao motor de eventos de toque.
- **Performance de UI**: Manter 60 FPS constants.

### Technical Constraints & Dependencies
- **Stack**: React 19, Capacitor 8.
- **IA**: Modelos Whisper (WASM/ONNX) e MediaPipe Face Mesh.
- **Memória**: Limite rígido de 2GB RAM no dispositivo alvo (Android 10+).

### Cross-Cutting Concerns Identified
- **Gestão de Energia**: Otimização de sampling rate para preservar bateria em uso contínuo.
- **Fallback de Voz**: Garantia de que a prancha básica responda mesmo se o worker de IA travar (Circuit Breaker).
- **Offline-First Total**: Todas as funções devem operar sem internet.

## Starter Template & Foundation Evaluation

### Primary Technology Domain
Mobile App (Hybrid) - React 19 + Capacitor 8 + Vite 7.

### Selected Foundation: Vite 7 "Clean Assistive" Architecture
**Rationale:** Foco em baixo overhead de memória (alvo 2GB RAM) e suporte nativo a Web Workers para Edge AI (Transformers.js v3 + MediaPipe).

**Initialization / Migration Strategy:**
A base do projeto deve ser migrada para o Vite 7 com a configuração `worker: { format: 'es' }` para suportar módulos de IA em threads separadas.

**Architectural Decisions Providenciadas:**

**AI Pipeline Integration (Web Workers):**
- **Whisper Worker**: Transcrição via `@huggingface/transformers` em segundo plano.
- **MediaPipe Worker**: Cálculo de EAR (Eye Aspect Ratio) para o Blink Trigger.

**Modularity & Feature Toggling (CRITICAL):**
- **Feature Manager**: Uma regra central de arquitetura exige que TODOS os recursos inteligentes (Escuta, Blink, Magnetismo) possuam um interruptor de liga/desliga independente.
- **Lazy Loading**: Recursos desabilitados não devem carregar os modelos de IA correspondentes na memória, preservando o limite de 2GB de RAM.

**Code Organization (MVC Rules):**
- `src/models`: Definição de `Symbol`, `Category` e os estados de predição.

## Core Architectural Decisions

### Data Architecture (Offline-First)

**Decisão**: **IndexedDB (via idb-keyval)**
- **Racional**: Gerenciar bibliotecas de símbolos ARASAAC e perfis de usuário sem os limites de 5MB do LocalStorage. Suporte nativo e eficiente a Blobs (imagens/ícones) no WebView do Capacitor.
- **Versão**: `idb-keyval ^6.2.0` (LTS estável).

### State Management & Modularity

**Decisão**: **Zustand (Selective Subscriptions)**
- **Racional**: Otimizado para performance em 2GB RAM (React 19). Impede re-renders em massa na prancha de símbolos ao atualizar estados de predição frequentes.
- **Feature Toggles (CRÍTICO)**: Cada recurso inteligente (Whisper, MediaPipe, Magnetismo) possui um toggle no Zustand que isola o Worker correspondente. Recursos desativados não são carregados na memória.
- **Versão**: `zustand ^5.0.0` (Native React 19 support).

### API & Communication Patterns

**Decisão**: **Async Event-Driven (Worker <-> UI)**
- **Fluxo**: Workers de IA (Produtores) emitem eventos via `postMessage`. O Store do Zustand (Consumidor) atualiza os estados (`prediction`, `blinkState`) se o recurso estiver habilitado.
- **Circuit Breaker**: Em caso de falha no Worker, o sistema reverte para o modo estático em < 1s, garantindo a resiliência comunicativa.

### Frontend Architecture Details

**Decisão**: **MVC-Hooks Controller Pattern**
- **Controllers as Hooks**: Toda a lógica de IO e IA reside em hooks customizados (ex: `useWhisperController.js`) que encapsulam os Toggles de On/Off.
- **Views**: Layouts puros (estrito Vanilla CSS) que consomem apenas os dados formatados pelos hooks.

### Infrastructure & Deployment (Local Focus)

**Decisão**: **Web MediaDevices API (Standard)**
- **Racional**: Captura de mic e câmera via WebView para portabilidade. Se a CPU do Android 10/11 for restritiva, migraremos para os Capacitor Native Core Plugins sem violar as regras de IA.
- **Build**: Vite 7 com workers em formato ESM (`format: 'es'`).

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Eventos de Worker (Worker Events):**
- **Sintaxe**: `CATEGORIA:AÇÃO` (ex: `IA:PREDICTION_UPDATE`, `BLINK:STATUS_CHANGED`).
- **Centralização**: Constantes em `src/models/events.js`.

**Feature Toggles (Zustand):**
- **Sintaxe**: `is[NomeRecurso]Enabled` (ex: `isWhisperEnabled`, `isBlinkEnabled`, `isMagnetEnabled`).
- **Comentários**: Obrigatórios em Português-BR para todos os métodos dos stores.

### Structure Patterns

**Localização de Recursos de IA:**
- **Workers**: `src/workers/[nome].worker.js`.
- **Worker Bridges**: Hooks em `src/controllers/use[Nome]Worker.js` que gerenciam a instância e o ciclo de vida (init/terminate).

### Format Patterns

**Sugestão Preditiva (Payload):**
```javascript
{ id: string, label: string, confidence: number, categoryId: string }
```

**Estado Biométrico (Blink State):**
```javascript
{ isEyeClosed: boolean, timestamp: number, confidence: number }
```

### Process Patterns

**Lazy Activation (Memory First):**
- O Worker **não deve** ser instanciado (`new Worker()`) até que o toggle `isEnabled` seja `true`.
- Ao desativar o recurso, o Controller deve obrigatoriamente chamar `worker.terminate()` para liberar os modelos da RAM (2GB RAM limit).

**Fallback Strategy (Resiliência):**
- Se a confiança da IA for `< 0.70`, o sistema mantém o estado atual do símbolo/prancha (IDLE), priorizando a estabilidade visual.
- Fallback em < 1s p/ Grade Estática em caso de erro fatal no Worker.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
app-fono/
├── android/                      # Projeto nativo Android (Capacitor)
├── public/
│   ├── models/                   # Modelos ONNX/WASM (Whisper/FaceMesh)
│   └── symbols/                  # Pictograms estáticos (ARASAAC local)
├── src/
│   ├── assets/                   # CSS Vanilla (Global e Temas)
│   ├── components/               # UI Pura (Componentes Atômicos)
│   │   ├── board/                # Grade de símbolos, Categorias
│   │   ├── ia/                   # Indicador de Mic, FaceMesh Overlay
│   │   └── shared/               # Botões, Modais, Toggles
│   ├── controllers/              # LÓGICA (MVC - Hooks)
│   │   ├── useBlinkController.js     # Ponte p/ Worker de Piscada
│   │   ├── useWhisperController.js   # Ponte p/ Worker de Áudio
│   │   └── useMagnetController.js    # Lógica de magnetismo visual
│   ├── workers/                  # PROCESSAMENTO (Threads Separadas)
│   │   ├── blink.worker.js       # MediaPipe EAR Calculation
│   │   └── whisper.worker.js     # Transformers.js Transcription
│   ├── models/                   # DEFINIÇÕES de Dados e Eventos
│   │   ├── events.js             # Constantes (ex: IA:PREDICTION)
│   │   └── schemas.js            # Esquemas de Prancha/Usuário
│   ├── stores/                   # ESTADO Global (Zustand)
│   │   ├── useFeatureStore.js    # Toggles de Recursos Inteligentes
│   │   └── useBoardStore.js      # Seleção de símbolos, Fila de fala
│   ├── services/                 # IO & EXTERNOS
│   │   ├── storage.js            # Wrapper IndexedDB (idb-keyval)
│   │   └── tts.js                # Serviço de Fala Nativa/Web
│   ├── views/                    # PÁGINAS (Telas de Fluxo)
│   │   ├── BoardView.jsx         # Prancha de Comunicação
│   │   ├── SettingsView.jsx      # Ajustes e Toggles
│   │   └── CalibrationView.jsx   # Calibração de IA (Blink/Mic)
│   ├── App.jsx                   # Componente Raiz e Rotas
│   └── main.jsx                  # Boot do React 19
├── vite.config.js                # Config de Build e Workers (ESM)
└── package.json                  # Stack de Modernização
```

### Architectural Boundaries & Mappings

**Recurso: Escuta Inteligente (Whisper)**
- **UI**: `src/components/ia/MicIndicator.jsx`
- **Controller**: `src/controllers/useWhisperController.js`
- **CPU**: `src/workers/whisper.worker.js`

**Recurso: Acionamento por Piscada (Blink)**
- **UI**: `src/components/ia/FaceOverlay.jsx`
- **Controller**: `src/controllers/useBlinkController.js`
- **CPU**: `src/workers/blink.worker.js`

- **Store**: Zustand unifica estados preditivos p/ pranchas (`BoardStore`).
- **Data Flow**: Unidirecional (Worker -> Store -> View).

## Architecture Validation Results

### Coherence Validation ✅
A triade **Vite 7 + Web Workers + Zustand** é compatível e optimizada para dispositivos com **2GB RAM**. O isolamento dos modelos de IA em threads separadas garante a fluidez da UI (60 FPS) exigida pelo PRD.

### Requirements Coverage Validation ✅
- **Functional**: Whisper, Blink e Magnetismo mimetizam a arquitetura física em `src/workers/` e lógica em `src/controllers/`.
- **Non-Functional**: O pipeline de processamento local respeita as restrições de latência (< 200ms) e a privacidade de buffers de áudio/vídeo (Zero Persistência).

### Implementation Readiness Validation ✅
A arquitetura fornece definições claras de nomenclaturas de eventos (`src/models/events.js`) e diretrizes de ciclo de vida de recursos inteligentes (Lazy Activation/Termination).

### Architecture Completeness Checklist
- [x] Contexto e escala (2GB RAM) analisados.
- [x] Stack tecnológica especificada (React 19 + Capacitor 8).
- [x] Padrões de naming e organização de pastas definidos.
- [x] Estratégia de Fallback e Resiliência documentada.

### Architecture Readiness Assessment
**Status Final**: **READY FOR IMPLEMENTATION**
**Nível de Confiança**: **ALTO**
- **Destaques**: Modularidade total (Toggles), Consistência de eventos entre Workers/Threads e Orientação a MVC (Controller-Hooks).
- **Handoff**: Siga as diretrizes de `project-context.md` e utilize o `vite.config.js` com suporte a ES Modules nos Workers.
