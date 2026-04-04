---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
inputDocuments: ['product-brief-App-Fono.md', 'product-brief-App-Fono-distillate.md', 'project-context.md']
workflowType: 'prd'
projectDocsCount: 3
briefCount: 2
researchCount: 0
brainstormingCount: 0
classification:
  projectType: 'mobile_app (Hybrid)'
  domain: 'healthcare/assistive-tech'
  complexity: 'high'
  projectContext: 'brownfield'
---

# Product Requirements Document - Comunica+ Inteligente

**Autor:** Thiago
**Data:** 2026-04-04

## Executive Summary

O **Comunica+ Inteligente** transforma sistemas de Comunicação Aumentativa e Alternativa (CAA) estáticos em assistentes preditivos dinâmicos. O foco central é reduzir a carga cognitiva de usuários autistas e com paralisia cerebral severa. Através da escuta ativa do ambiente (Edge AI), o sistema antecipa necessidades comunicativas e simplifica a interface no momento exato da interação social.

### Diferenciais Estratégicos

* **Escuta Ativa Centrada no Interlocutor**: O sistema utiliza o contexto da fala do terapeuta ou cuidador para filtrar e sugerir pictogramas, eliminando a busca exaustiva por ícones.
* **Acessibilidade Adaptativa**: Implementação de "Ímã Digital" para correção de toque e "Blink Trigger" para acionamento via piscada, permitindo que usuários com limitações motoras severas recuperem sua autonomia.

## Project Classification

* **Tipo de Projeto**: Aplicativo Mobile Híbrido (React 19 / Capacitor 8).
* **Domínio**: Saúde e Tecnologia Assistiva (Alta Complexidade / Rigor Clínico / LGPD).
* **Contexto**: Modernização de sistema legado (Brownfield) focado em IA assistiva.

## Success Criteria

### User & Clinical Success
* **Autonomia**: Aumento na frequência de iniciação comunicativa espontânea pelo usuário.
* **Fluidez Terapêutica**: 80% dos fonoaudiólogos relatam redução no atrito de navegação durante as sessões.

### Technical Success
* **Performance Edge**: Latência de predição e rastreio de piscada < 200ms em hardware de 2GB RAM.
* **Privacidade Total**: 100% de conformidade com LGPD (processamento local, zero persistência de áudio/vídeo).
* **Eficiência**: Consumo de bateria inferior a 15% por hora de uso contínuo com modelos de IA ativos.

## Product Scope

### Phase 1 (MVP) - Validação Clínica
* **STT Local**: Whisper (WASM/Native) para transcrição em Português-BR.
* **Motor Preditivo**: NLP básico para sugestão de categorias de pictogramas.
* **Correção Motora**: Algoritmo de Magnetismo de Toque e detecção de piscada voluntária.
* **Modo Enxuto**: Interface simplificada com 4 ícones gigantes para momentos de alta carga cognitiva.

### Phase 2 (Growth)
* **Internacionalização**: Ativação dos 7 idiomas mapeados.
* **Setup Granular**: UI de calibração fina para sensibilidade de face e toque.
* **Logs Terapêuticos**: Dashboards locais de evolução para acompanhamento clínico.

### Phase 3 (Vision)
* **Consciência Espacial**: Predição baseada em GPS/Geofencing.
* **Ecossistema IoT**: Controle de ambiente (luz, som) via pictogramas.

## User Journeys

### J1: A Antecipação na Terapia
A Fono pergunta: *"Léo, você quer o suco?"*. O app detecta a palavra-chave e apresenta imediatamente o ícone de bebidas em destaque. Léo confirma sua escolha com uma piscada voluntária, sem precisar buscar o símbolo na grade completa.

### J2: Resiliência em Ambientes Ruidosos
Em um shopping barulhento, o cuidador aciona o **Modo Manual**. O sistema pausa a IA de escuta, transformando-se em uma prancha estática estável, garantindo que a tecnologia não crie ruído visual adicional em momentos de sobrecarga.

## Functional Requirements

### Comunicação Assistiva
* **FR1**: O Usuário pode navegar por categorias de pictogramas ARASAAC.
* **FR2**: O Usuário pode selecionar um pictograma para reprodução de áudio TTS.
* **FR3**: O Usuário pode visualizar e editar uma "Barra de Frase".
* **FR4**: O Usuário pode apagar o último ícone selecionado ou limpar toda a frase.
* **FR5**: O Usuário pode alternar entre "Modo Enxuto" (4 ícones) e "Modo Grade" (padrão).

### Inteligência e Predição
* **FR6**: O Sistema pode captar e transcrever áudio ambiente em tempo real.
* **FR7**: O Sistema pode sugerir pictogramas baseados no contexto detectado.
* **FR8**: O Sistema pode realizar a troca automática de pranchas sob alta confiança preditiva.

### Entradas Biométricas e Assistentes
* **FR9**: O Sistema pode detectar piscadas voluntárias via câmera frontal para confirmação.
* **FR10**: O Sistema pode corrigir coordenadas de toque imprecisas ("Ímã de Toque").
* **FR11**: O Sistema fornece feedback háptico (vibração) ao realizar correções motoras.

## Non-Functional Requirements

### Qualidade e Segurança
* **NFR1 (Latência)**: Resposta da IA e feedback de interface < 200ms.
* **NFR2 (Privacidade)**: Proibida a gravação de áudio/vídeo em disco; processamento 100% volátil.
* **NFR3 (Acessibilidade)**: Contraste WCAG AAA e rejeição de tremores em toques múltiplos (< 300ms).
* **NFR4 (Resiliência)**: Fallback para modo estático em < 1s caso a IA falhe.

## Innovation & Novel Patterns
O projeto desafia a passividade dos sistemas de CAA atuais. A inovação reside no **Interlocutor-Centric Prediction**, onde o software ouve o mundo para servir o usuário, e no **Magnetismo Digital Reactivo**, que adapta a interface à falha motora em tempo real.
