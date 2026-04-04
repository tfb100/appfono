# Projeto Comunica+

**Comunicação que Aproxima**

---

## Visão Geral

O **Comunica+** é uma ferramenta gratuita de **Comunicação Aumentativa e Alternativa (CAA)** desenvolvida para apoiar o desenvolvimento da fala e a interação social de crianças e adultos com dificuldades de comunicação.

O projeto é desenvolvido com React + Vite e está disponível como aplicação web responsiva, podendo ser acessado via navegador ou instalado como app nativo (Android via Capacitor).

---

## Funcionalidades Implementadas

### 1. Sistema de Símbolos pictográficos

- **70+ símbolos** organizados em categorias:
  - **Sociais**: Olá, Sim, Não, Ajuda, Por quê?, Bom dia, Boa tarde, Boa noite, Tchau
  - **Pessoas**: Eu, Você, Quem, Mamãe, Papai, Vovô, Vovó
  - **Verbos**: Querer, Gostar, Comer, Beber, Ir, Fazer, Ver, Abrir, Dormir, Brincar, Sou, Estou, Fechar, Ganhei, Perdi
  - **Lugares**: Banheiro, Casa, Cozinha, Quarto, Sala, Pátio
  - **Descritivos**: Aqui, Lá, Isso, Grande, Pequeno, Mais, Acabou
  - **Sentimentos**: Feliz, Triste, Dor, Sono, Cansado

- **Suporte multilíngue**: Português, English, Español, Deutsch, Français, 中文, 日本語

### 2. Síntese de Voz (TTS)

- Utiliza a API de Síntese de Voz do navegador
- Seleção de voz por idioma e gênero (masculino/feminino)
- Ajuste de velocidade da fala
- Cache automático de vozes por idioma

### 3. Recursos de Personalização

- **Temas visuais**: Kids (colorido), Neutral, Neutral Dark
- **Paletas de cores**: Classic, Pastel, High Contrast
- **Estilo de ícones**: Minimalista (Lucide Icons) ou Colorful (imagens PNG)
- **Tamanho dos cartões**: Normal ou Grande
- **Cor do texto**: Branco ou Preto

### 4. Sistema de Favoritos e Estatísticas

- Favoritos manuais (selecionáveis pelo usuário)
- Símbolos mais usados (automático, baseado em uso)
- Dashboard de estatísticas de uso
- Persistência local (localStorage)

### 5. Cartões Personalizados

- Criação de novos símbolos pelo usuário
- Edição e exclusão de símbolos personalizados
- Possibilidade de adicionar aos favoritos

### 6. Integração com VLibras

- Suporte opcional para tradução em Libras (brasileira)

---

## Arquitetura Técnica

```
src/
├── App.jsx                 # Router principal
├── views/
│   ├── LandingPage.jsx    # Página inicial com informações
│   └── ToolView.jsx       # Aplicativo principal
├── components/
│   ├── SymbolGrid.jsx     # Grade de símbolos
│   ├── SettingsPanel.jsx # Painel de configurações
│   ├── SupportFooter.jsx # Rodapé com suporte/doações
│   └── DonationModal.jsx # Modal de doações
├── controllers/
│   └── useAppController.js # Hook principal de lógica
├── models/
│   └── QuoteSymbols.jsx  # Banco de dados de símbolos
├── hooks/
│   ├── useTTS.js          # Síntese de voz
│   ├── useAudioPlayer.js  # Reprodução de áudio
│   └── useVLibras.js      # Integração VLibras
├── utils/
│   └── translations.js    # Traduções da interface
└── styles/
    ├── main.css           # Estilos globais
    └── components.css     # Estilos dos componentes
```

---

## Stack Tecnológico

| Categoria | Tecnologia |
|-----------|------------|
| Frontend | React 19 + Vite 7 |
| Router | React Router DOM 7 |
| Ícones | Lucide React |
| SEO | React Helmet Async |
| Mobile | Capacitor 8 |
| TTS Mobile | @capacitor-community/text-to-speech |
| State | React Hooks + localStorage |
| Build | ESLint + Vite |

---

## Paleta de Cores

### Tema Kids (Padrão)
- Primária: `#F48C06` (Laranja Vivo)
- Secundária: `#DC2F02` (Vermelho Laranja)
- Fundo: `#FFF8F0` (Creme Laranja)
- Texto: `#370617` (Vermelho Escuro)
- Acento: `#FFBA08` (Amarelo Laranja)

---

## Páginas

### Landing Page (`/comunicamais`)
- Hero section com chamada para ação
- Cards informativos sobre fonoaudiologia e CAA
- Newsletter para cadastro
- Footer com links institucionais

### Tool View (`/comunicamais/app`)
- Header com logo e botão de configurações
- Grade de símbolos organizados por categorias
- Favoritos e símbolos frequentes
- Rodapé com opção de suporte

---

## Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

---

## Público-Alvo

- **Crianças** com dificuldades de fala e comunicação
- **Famílias** que desejam auxiliar no desenvolvimento linguístico
- **Fonoaudiólogos** e terapeutas que utilizam CAA em tratamentos
- **Cuidadores** e profissionais de apoio
- **Pessoas com TEA**, deficiência auditiva, ou condições que afetam a comunicação

---

## Diferenciais do Projeto

1. **Gratuito e open-source** - Não requer pagamento ou assinatura
2. **Multiplataforma** - Funciona no navegador, mobile e pode ser empacotado
3. **Multilíngue** - Interface e símbolos em 7 idiomas
4. **Personalizável** - Temas, cores, vozes e símbolos customizáveis
5. **Focado em acessibilidade** - Design intuitivo para crianças e pessoas com necessidades especiais
6. **Sem necessidade de login** - Dados armazenados localmente
7. **Integração VLibras** - Suporte para comunidade surda

---

## Próximos Passos

- [ ] Publicação na Google Play Store
- [ ] Adição de mais símbolos e categorias
- [ ] Sincronização na nuvem (conta opcional)
- [ ] Modo offline completo
- [ ] Sistema de frases compostas
- [ ] Relatórios de progresso para terapeutas

---

## Licença e Contribuição

O Comunica+ é um projeto open-source desenvolvido com carinho para ajudar famílias e profissionais da saúde.

**Contato**: O projeto faz parte do grupo [OQConecta.tech](https://oqconecta.tech)

---

*© 2026 - Comunica+ feito para ajudar.*
