# Roadmap de Upgrade: Sistema de CAA Inteligente e Preditivo

## 1. Visão Geral
Transformar a ferramenta de Comunicação Aumentativa e Alternativa (CAA) estática em um sistema dinâmico que utiliza Processamento de Linguagem Natural (NLP) para auxiliar a pessoa autista na seleção de pictogramas, baseando-se no contexto sonoro do ambiente (fala do fonoaudiólogo/tutor).

## 2. Objetivos Principais
* **Redução de Carga Cognitiva:** Filtrar opções relevantes para evitar o "sequestro visual" por excesso de botões.
* **Agilidade na Resposta:** Diminuir o tempo entre a pergunta do interlocutor e a resposta do usuário.
* **Foco na Objetividade:** Priorizar respostas simples (Sim/Não, Sentimentos, Necessidades Básicas).

## 3. Arquitetura do Upgrade (Camada de IA)

### 3.1. Módulo de Escuta Ativa (STT)
* **Tecnologia Sugerida:** OpenAI Whisper (Local/Tiny model) ou Google Speech-to-Text.
* **Requisito:** Baixa latência (processamento em < 1 segundo).
* **Filtro de Ruído:** Algoritmo para isolar a voz do fonoaudiólogo em ambientes de consultório.

### 3.2. Motor de Contexto (NLP)
* **Lógica de Gatilho:** Identificação de palavras-chave e intenções (Ex: "Onde", "Quem", "Sentindo", "Quer").
* **Mapeamento de Categorias:**
    * *Pergunta de Lugar* -> Ativa Categoria: Lugares/Ambientes.
    * *Pergunta de Desejo* -> Ativa Categoria: Alimentos/Brinquedos/Ações.
    * *Pergunta de Emoção* -> Ativa Categoria: Sentimentos/Estado Físico.

## 4. Requisitos de Interface (UX/UI)

### 4.1. Visualização Preditiva
* **Slot de Sugestões:** Uma barra superior com os 4 pictogramas de maior probabilidade.
* **Feedback Visual:** O pictograma sugerido deve ter um contorno suave para atrair a atenção sem causar desconforto sensorial.
* **Modo de Confirmação:** Opção de "Limpar Sugestões" caso a IA erre o contexto, retornando ao menu principal.

### 4.2. Acessibilidade
* **Alto Contraste:** Suporte para temas escuros/claros conforme a sensibilidade do usuário.
* **Sintetização de Voz (TTS):** Vozes humanizadas e sem entonação robótica agressiva.

## 5. Fluxo de Desenvolvimento Sugerido

1.  **Fase 1 (MVP):** Implementar o escutador de palavras-chave simples (Keywords) que abre pastas específicas.
2.  **Fase 2 (NLP):** Integrar modelo de linguagem para entender frases complexas e variações linguísticas.
3.  **Fase 3 (Personalização):** Permitir que o fonoaudiólogo cadastre "Dicionários de Contexto" específicos para a rotina de cada paciente.

## 6. Stack Tecnológica de Referência
* **Linguagem:** Python (Backend/IA).
* **Framework Mobile:** Flutter ou React Native.
* **Modelos:** Whisper (Audio-to-Text) + BERT ou Llama-3-Small (Intention Classification).

---
*Documento versionado em: 2026-04-04*
*Responsável: Thiago Freitas Barcelos*