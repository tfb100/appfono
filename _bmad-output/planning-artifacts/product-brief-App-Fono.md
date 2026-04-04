---
title: "Product Brief: App - Fono (Smart CAA Upgrade)"
status: "complete"
created: "2026-04-04T18:41:00Z"
updated: "2026-04-04T18:41:00Z"
inputs: ["Roadmap de Upgrade Sistema de CAA Inteligente e Preditivo.md", "project-context.md"]
---

# Product Brief: Comunica+ Inteligente (Upgrade CAA)

## Sumário Executivo

O **Comunica+ Inteligente** é uma evolução do aplicativo de Comunicação Aumentativa e Alternativa (CAA) voltado para pessoas autistas e com dificuldades severas de fala. O sistema deixa de ser uma prancha estática para se tornar um assistente preditivo que utiliza Inteligência Artificial (STT e NLP) para ouvir o ambiente clínico ou escolar e sugerir, em tempo real, as respostas mais prováveis.

Este upgrade foca na **redução drástica da carga cognitiva** e na solução de problemas motores através de tecnologias de "Imã de Clique" e acionamento por piscadelas (Blink-to-activate), tudo otimizado para funcionar em dispositivos de baixo custo.

## O Problema

Para muitas crianças autistas, a comunicação via pranchas tradicionais é frustrante e lenta. Dois grandes gargalos impedem a autonomia:

1. **Sobrecarga Cognitiva**: O "sequestro visual" causado por centenas de ícones faz com que o usuário perca o foco na interação social enquanto tenta encontrar o botão certo.
2. **Dificuldade Motora**: Muitas crianças não possuem a precisão necessária para tocar em ícones pequenos, resultando em seleções erradas e desistência da comunicação.

Hoje, o tempo de resposta entre uma pergunta do fonoaudiólogo e a seleção do pictograma é alto demais, quebrando o fluxo da interação humana.

## A Solução

Estamos construindo uma camada de inteligência e acessibilidade sobre a estrutura atual:

* **Escuta Ativa (STT)**: O app "ouve" o interlocutor (fonoaudiólogo/tutor) e identifica palavras-chave.
* **Motor Preditor (NLP)**: Se o tutor pergunta "O que você quer?", o app destaca automaticamente categorias de desejos/alimentos.
* **UX Amigável**: Introdução do **Modo Enxuto**, que exibe apenas 4 ícones gigantes na tela, baseados nas sugestões da IA.
* **Magnetismo Digital**: O sistema corrige toques imprecisos, "atraindo" o clique para o símbolo mais próximo, evitando o erro motor.
* **Blink Trigger**: Usuários com limitações motoras severas podem confirmar seleções apenas piscando os olhos. O sistema inclui um **Modo de Calibração** rápido e intuitivo para garantir a precisão em diferentes condições de iluminação.

## O Que Nos Diferencia

Diferente de competidores como Livox ou Spoken, que focam no que o usuário está digitando, o **Comunica+ foca no que o usuário está OUVINDO**.

* **Antecipação Contextual**: Somos o primeiro app gratuito a integrar escuta ativa ambiental para filtragem de pranchas.
* **Otimização para Baixo Custo**: O software é desenhado para rodar modelos de IA leves (Edge AI), permitindo que tablets populares em escolas públicas possam oferecer tecnologia de ponta.
* **Interação em Camadas**: O processamento de IA é sequencial para economizar recursos (Escuta -> Predição -> Assistência Visual).

## Privacidade e Segurança

* **Processamento 100% Local (Edge AI)**: Nenhum áudio ou imagem da câmera para rastreio de piscadas sai do dispositivo. Todo o processamento Whisper e NLP ocorre offline, garantindo o sigilo ético da terapia.
* **Sem Armazenamento de Áudio**: O sistema processa o áudio em tempo real para extrair intenção e descarta o arquivo imediatamente.

## Tratamento de Erros e UX

* **Botão de Reset Rápido**: Caso a IA sugira uma categoria errada por ruído ambiente, um botão de destaque "Voltar ao Início" estará sempre acessível para o usuário.
* **Modo Manual (Pausa IA)**: Um interruptor rápido permite desativar a escuta ativa em ambientes extremamente ruidosos (pátios, refeitórios), mantendo o app como uma prancha de CAA tradicional.
* **Ímã de Clique Inteligente**: A atração magnética ignora toques acidentais (arrastos leves) e foca na intenção de clique no centro do ícone mais próximo.

## Quem Isso Serve

1. **Usuários com Autismo e/ou Paralisia Cerebral**: Aqueles que precisam de ajuda para organizar o pensamento e precisão no toque.
2. **Fonoaudiólogos e Terapeutas**: Profissionais que ganham uma ferramenta que "trabalha junto" com a sessão, agilizando a plasticidade comunicativa.
3. **Cuidadores e Professores**: Facilitando a comunicação no dia a dia sem a necessidade de manuais complexos.

## Critérios de Sucesso

* **Velocidade**: Redução de 50% no tempo de seleção de um símbolo após uma pergunta externa.
* **Precisão**: Taxa de acerto de 90% na predição de categorias baseada em palavras-chave.
* **Adoção**: Implementação bem-sucedida do "Blink Trigger" em dispositivos com processamento limitado.
* **Engajamento**: Aumento na quantidade de interações iniciadas pelo próprio usuário (autonomia).

## Escopo (V1)

* **In**: Integração Whisper (STT local), Motor de Contexto para 5 categorias principais, Modo 4 Ícones, Ímã de Clique.
* **Out**: Tradução em tempo real de voz, geração de relatórios complexos na nuvem, integração com redes sociais.

## Visão

Em 2 anos, o Comunica+ será um ecossistema que aprende com a rotina da criança, sugerindo atividades baseadas na hora do dia e no local (GPS), tornando-se a voz natural e inteligente de milhares de brasileiros.
