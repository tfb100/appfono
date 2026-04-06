import { pipeline, env } from '@huggingface/transformers';
import { IA_EVENTS } from '../models/events';

// Configuração do Ambiente do Motor de Contexto
try {
    if (typeof env !== 'undefined') {
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        if (!env.onnx) env.onnx = {};
        env.onnx.logLevel = 'error';
    }
} catch (e) {}

let classifier = null;

/**
 * Singleton do modelo de vetorização (máx ~90MB RAM)
 */
const getClassifier = async () => {
    if (!classifier) {
        classifier = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return classifier;
};

// ============================================================
//  SISTEMA DE DETECÇÃO DE INTENÇÃO POR PONTUAÇÃO DE PALAVRAS
//  Tolerante a transcrições ruidosas do Whisper.
//  Uma única palavra forte já é suficiente para detectar a intenção.
// ============================================================

/**
 * Normaliza texto: remove acentos, pontuação e converte para minúsculas.
 * Trata gírias comuns que o Whisper pode transcrever.
 */
function normalizeText(text) {
    let t = text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')  // Remove acentos
        .replace(/[^a-z0-9\s]/g, ' ')    // Remove pontuação
        .replace(/\s+/g, ' ')            // Colapsa espaços múltiplos
        .trim();

    // Correções comuns de transcrição do Whisper em português
    const WHISPER_FIXES = {
        // Coloquialismos
        ' ce ': ' voce ', ' vc ': ' voce ', ' cê ': ' voce ',
        ' ta ': ' esta ', ' to ': ' estou ',
        ' pra ': ' para ', ' pro ': ' para o ',
        ' ne ': ' nao e ', ' num ': ' nao ',
        ' de ': ' de ',
        // Aglutinações do Whisper
        'aonde': 'onde', 'cadê': 'onde esta',
        'cade': 'onde esta',
        // Ruído comum (Whisper ouve "música" de fundo)
        'thank you': '', 'you': '', 'the': '', 'and': '',
        'subscribe': '', 'music': '', 'applause': '',
    };

    for (const [from, to] of Object.entries(WHISPER_FIXES)) {
        t = t.replace(new RegExp(from, 'g'), to);
    }

    return t.replace(/\s+/g, ' ').trim();
}

/**
 * PALAVRAS-GATILHO com pontuação por intenção.
 * Cada palavra carrega uma pontuação para uma ou mais intenções.
 * Uma palavra forte (3 pts) sozinha já basta.
 * Palavras fracas (1 pt) precisam de combinação.
 *
 * THRESHOLD MÍNIMO: 3 pontos para ativação.
 */
const WORD_SCORES = {
    // === LOCALIZAÇÃO (ONDE_ESTOU) ===
    'onde':      { 'ONDE_ESTOU': 4 },               // "onde" sozinho já é decisivo
    'aonde':     { 'ONDE_ESTOU': 4 },
    'lugar':     { 'ONDE_ESTOU': 2 },
    'local':     { 'ONDE_ESTOU': 2 },
    'casa':      { 'ONDE_ESTOU': 1, 'QUERER_BRINCAR': 0.5 },
    'escola':    { 'ONDE_ESTOU': 1.5 },
    'parque':    { 'ONDE_ESTOU': 1, 'QUERER_BRINCAR': 1 },
    'banheiro':  { 'ONDE_ESTOU': 1, 'HIGIENE_NECESSIDADE': 3 },
    'quarto':    { 'ONDE_ESTOU': 1.5 },
    'cozinha':   { 'ONDE_ESTOU': 1.5 },
    'sala':      { 'ONDE_ESTOU': 1.5 },
    'patio':     { 'ONDE_ESTOU': 1.5 },
    'aqui':      { 'ONDE_ESTOU': 1 },
    'la':        { 'ONDE_ESTOU': 0.5 },
    'fica':      { 'ONDE_ESTOU': 1 },

    // === COMIDA / BEBIDA ===
    'comer':     { 'QUERER_COMER_BEBER': 3 },
    'beber':     { 'QUERER_COMER_BEBER': 3 },
    'comida':    { 'QUERER_COMER_BEBER': 3 },
    'fome':      { 'QUERER_COMER_BEBER': 4 },
    'sede':      { 'QUERER_COMER_BEBER': 4 },
    'agua':      { 'QUERER_COMER_BEBER': 2 },
    'suco':      { 'QUERER_COMER_BEBER': 3 },
    'lanche':    { 'QUERER_COMER_BEBER': 3 },
    'almoco':    { 'QUERER_COMER_BEBER': 3 },
    'janta':     { 'QUERER_COMER_BEBER': 3 },

    // === BRINCAR ===
    'brincar':   { 'QUERER_BRINCAR': 4 },
    'brinquedo': { 'QUERER_BRINCAR': 4 },
    'bola':      { 'QUERER_BRINCAR': 3 },
    'boneca':    { 'QUERER_BRINCAR': 3 },
    'jogar':     { 'QUERER_BRINCAR': 3 },
    'correr':    { 'QUERER_BRINCAR': 2 },
    'pular':     { 'QUERER_BRINCAR': 2 },
    'diversao':  { 'QUERER_BRINCAR': 2 },

    // === HIGIENE ===
    'xixi':      { 'HIGIENE_NECESSIDADE': 5 },
    'coco':      { 'HIGIENE_NECESSIDADE': 5 },
    'banho':     { 'HIGIENE_NECESSIDADE': 3 },
    'trocar':    { 'HIGIENE_NECESSIDADE': 2 },
    'fralda':    { 'HIGIENE_NECESSIDADE': 4 },
    'escovar':   { 'HIGIENE_NECESSIDADE': 3 },
    'dente':     { 'HIGIENE_NECESSIDADE': 2, 'SENTIMENTOS': 0.5 },

    // === IDENTIDADE ===
    'quem':      { 'QUEM_SOU_EU_TU': 4 },
    'nome':      { 'QUEM_SOU_EU_TU': 2 },
    'chama':     { 'QUEM_SOU_EU_TU': 2 },
    'mamae':     { 'QUEM_SOU_EU_TU': 2 },
    'papai':     { 'QUEM_SOU_EU_TU': 2 },
    'vovo':      { 'QUEM_SOU_EU_TU': 2 },
    'familia':   { 'QUEM_SOU_EU_TU': 2 },

    // === AJUDA ===
    'ajuda':     { 'PEDIR_AJUDA': 4 },
    'socorro':   { 'PEDIR_AJUDA': 5 },
    'perdido':   { 'PEDIR_AJUDA': 2 },
    'consigo':   { 'PEDIR_AJUDA': 1 },
    'nao':       { 'PEDIR_AJUDA': 0.5 },
    'preciso':   { 'PEDIR_AJUDA': 1.5 },

    // === SENTIMENTOS ===
    'sentimento': { 'SENTIMENTOS': 4 },
    'sentimentos': { 'SENTIMENTOS': 4 },
    'sente':     { 'SENTIMENTOS': 4 },
    'sinto':     { 'SENTIMENTOS': 4 },
    'humor':     { 'SENTIMENTOS': 3 },
    'emocao':    { 'SENTIMENTOS': 3 },
    'feliz':     { 'SENTIMENTOS': 4 },
    'triste':    { 'SENTIMENTOS': 4 },
    'bravo':     { 'SENTIMENTOS': 4 },
    'irritado':  { 'SENTIMENTOS': 4 },
    'cansado':   { 'SENTIMENTOS': 3 },
    'sono':      { 'SENTIMENTOS': 3 },
    'dor':       { 'SENTIMENTOS': 3 },
    'medo':      { 'SENTIMENTOS': 3 },
    'doente':    { 'SENTIMENTOS': 3 },
    'chorando':  { 'SENTIMENTOS': 3 },
    'choro':     { 'SENTIMENTOS': 3 },
    'raiva':     { 'SENTIMENTOS': 3 },
    'animado':   { 'SENTIMENTOS': 3 },

    // === SAUDAÇÃO ===
    'ola':       { 'SOCIAL_SAUDACAO': 4 },
    'oi':        { 'SOCIAL_SAUDACAO': 3 },
    'dia':       { 'SOCIAL_SAUDACAO': 1.5 },
    'tarde':     { 'SOCIAL_SAUDACAO': 1.5 },
    'noite':     { 'SOCIAL_SAUDACAO': 1.5 },
    'bom':       { 'SOCIAL_SAUDACAO': 1.5, 'SENTIMENTOS': 0.5 },
    'boa':       { 'SOCIAL_SAUDACAO': 1.5 },

    // === DESPEDIDA ===
    'tchau':     { 'SOCIAL_DESPEDIDA': 5 },
    'adeus':     { 'SOCIAL_DESPEDIDA': 5 },
    'embora':    { 'SOCIAL_DESPEDIDA': 3 },
    'logo':      { 'SOCIAL_DESPEDIDA': 1.5 },
    'ate':       { 'SOCIAL_DESPEDIDA': 1 },

    // === PALAVRAS CONTEXTUAIS (sem valor alto isolado) ===
    'voce':      {},   // Sem valor — aparece em muitos contextos
    'esta':      {},   // Sem valor — aparece em muitos contextos
    'estou':     { 'SENTIMENTOS': 1 },
    'eu':        {},
    'quer':      { 'QUERER_COMER_BEBER': 1.5, 'QUERER_BRINCAR': 1.5 },
    'quero':     { 'QUERER_COMER_BEBER': 1.5, 'QUERER_BRINCAR': 1.5 },
    'vamos':     { 'QUERER_BRINCAR': 1, 'ONDE_ESTOU': 1 },
};

const INTENT_THRESHOLD = 3; // Pontuação mínima para ativar uma intenção

/**
 * Detecta intenção por pontuação acumulada de palavras
 */
function detectIntentByWordScoring(normalizedText) {
    const words = normalizedText.split(' ').filter(w => w.length > 1);
    const scores = {};

    for (const word of words) {
        const wordData = WORD_SCORES[word];
        if (wordData) {
            for (const [intent, pts] of Object.entries(wordData)) {
                scores[intent] = (scores[intent] || 0) + pts;
            }
        }
    }

    // Encontra a intenção com maior pontuação
    let bestIntent = null;
    let bestScore = 0;
    for (const [intent, score] of Object.entries(scores)) {
        if (score > bestScore) {
            bestScore = score;
            bestIntent = intent;
        }
    }

    return {
        intent: bestScore >= INTENT_THRESHOLD ? bestIntent : null,
        score: bestScore,
        allScores: scores
    };
}

// ============================================================
//  CONCEITOS DE RESPOSTA (Stage 2 — Ranking de Cards)
// ============================================================

/**
 * Dado uma intenção detectada, qual conjunto de palavras
 * devemos usar para rankear os cards de RESPOSTA?
 */
const RESPONSE_CONCEPTS = {
    'ONDE_ESTOU':           'aqui lá banheiro quarto cozinha sala casa escola pátio parque lugar posição',
    'QUERER_COMER_BEBER':   'comer beber comida água suco leite pão fruta lanche sim não quero',
    'QUERER_BRINCAR':       'brincar parque bola boneca jogar correr sim não quero diversão',
    'PEDIR_AJUDA':          'ajuda sim não preciso socorro mamãe papai',
    'SOCIAL_SAUDACAO':      'olá oi bom dia boa tarde boa noite tudo bem sim',
    'SOCIAL_DESPEDIDA':     'tchau adeus até logo embora acabou',
    'QUEM_SOU_EU_TU':       'eu você mamãe papai vovô vovó quem nome',
    'SENTIMENTOS':          'feliz triste cansado sono dor animado bravo irritado medo alegre chorar emoção sentimento humor',
    'HIGIENE_NECESSIDADE':  'banheiro sim não quero ir acabou',
};

// ============================================================
//  VETORIZAÇÃO E CACHE
// ============================================================

function cosineSimilarity(vecA, vecB) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

let conceptCache = null;  // vetores das intenções (para fallback)
let symbolCache = null;   // vetores dos cards (para ranking)
let responseVectorCache = null; // vetores dos conceitos de resposta (pré-computado)
let pendingAnalysis = [];

const ensureConceptCache = async (model) => {
    if (conceptCache) return conceptCache;
    conceptCache = {};
    const INTENT_CONCEPTS = {
        'QUERER_COMER_BEBER': 'fome sede comer beber comida bebida lanche suco água vontade café almoço janta',
        'QUERER_BRINCAR': 'brincar brinquedo jogo diversão passear bola boneca carrinho correr parque pular',
        'PEDIR_AJUDA': 'ajuda socorro difícil mal ruim dor machucado medo assustado perdido não consigo',
        'SOCIAL_SAUDACAO': 'oi olá tudo bem como vai bom dia boa tarde boa noite prazer conhecer',
        'SOCIAL_DESPEDIDA': 'tchau adeus até logo embora sair fui dormindo sono boa noite descansar',
        'QUEM_SOU_EU_TU': 'identidade quem é nome mamãe papai família irmão irmã vovô vovó',
        'ONDE_ESTOU': 'onde lugar casa escola parque banheiro quarto cozinha sala pátio aqui lá posição localização',
        'SENTIMENTOS': 'sentimento feliz triste bravo irritado cansado sono doente dor choro',
        'HIGIENE_NECESSIDADE': 'banheiro xixi cocô limpar banho trocar fralda dente escovar',
    };
    for (const [intent, keywords] of Object.entries(INTENT_CONCEPTS)) {
        const output = await model(keywords, { pooling: 'mean', normalize: true });
        conceptCache[intent] = output.data;
    }
    return conceptCache;
};

/**
 * Pré-computa vetores dos conceitos de resposta (feito uma vez)
 */
const ensureResponseVectorCache = async (model) => {
    if (responseVectorCache) return responseVectorCache;
    responseVectorCache = {};
    for (const [intent, concept] of Object.entries(RESPONSE_CONCEPTS)) {
        const output = await model(concept, { pooling: 'mean', normalize: true });
        responseVectorCache[intent] = output.data;
    }
    console.log(`[ContextWorker] Cache de conceitos de resposta pronto (${Object.keys(responseVectorCache).length} intenções).`);
    return responseVectorCache;
};

const ensureSymbolCache = async (model, symbols) => {
    if (symbols && symbols.length > 0) {
        symbolCache = [];
        console.log(`[ContextWorker] Gerando cache semântico para ${symbols.length} símbolos...`);
        for (const symbol of symbols) {
            const label = (symbol.label && typeof symbol.label === 'object')
                ? (symbol.label.pt || Object.values(symbol.label)[0])
                : (symbol.label || '');
            const output = await model(label, { pooling: 'mean', normalize: true });
            symbolCache.push({ id: symbol.id, vector: output.data, label });
        }
        console.log(`[ContextWorker] Cache de ${symbolCache.length} símbolos pronto.`);
    }
    return symbolCache || [];
};

// ============================================================
//  ANÁLISE PRINCIPAL (Pipeline de 2 Estágios)
// ============================================================

const runAnalysis = async (text) => {
    const model = await getClassifier();
    const cache = await ensureConceptCache(model);
    const respCache = await ensureResponseVectorCache(model);
    const currentSymbols = symbolCache || [];

    // Limpeza e normalização do texto
    const cleanText = text.replace(/\[.*?\]/g, '').toLowerCase().trim();
    if (!cleanText || cleanText.length < 2) return;

    const normalizedText = normalizeText(cleanText);
    if (!normalizedText || normalizedText.length < 2) return;

    console.log(`[ContextWorker] Analisando: "${cleanText}" → normalizado: "${normalizedText}"`);

    // ── STAGE 1: Detecção de Intenção ──
    let bestIntent = 'UNKNOWN';
    let maxIntentScore = 0;

    // 1a. Pontuação por palavras-gatilho (principal — tolerante a ruído)
    const wordResult = detectIntentByWordScoring(normalizedText);
    if (wordResult.intent) {
        bestIntent = wordResult.intent;
        maxIntentScore = 1.0;
        console.log(`[ContextWorker] ✓ Word-Score: ${bestIntent} (${wordResult.score} pts) | Parciais: ${JSON.stringify(wordResult.allScores)}`);
    }

    // 1b. Fallback: similaridade vetorial com conceitos de intenção
    if (bestIntent === 'UNKNOWN') {
        const outputText = await model(normalizedText, { pooling: 'mean', normalize: true });
        const vectorText = outputText.data;

        for (const [intent, vectorConcept] of Object.entries(cache)) {
            const score = cosineSimilarity(vectorText, vectorConcept);
            if (score > maxIntentScore) {
                maxIntentScore = score;
                bestIntent = intent;
            }
        }
        console.log(`[ContextWorker] ⚠ Fallback vetorial: ${bestIntent} (${maxIntentScore.toFixed(2)})`);

        // Se a confiança vetorial for muito baixa, não vale a pena sugerir
        if (maxIntentScore < 0.25) {
            console.log(`[ContextWorker] ✗ Confiança muito baixa (${maxIntentScore.toFixed(2)}) — ignorando.`);
            return;
        }
    }

    // ── STAGE 2: Ranking de Cards via Conceito de Resposta ──
    let rankedSymbols = [];
    if (currentSymbols.length > 0) {
        // Usa o vetor PRÉ-COMPUTADO do conceito de resposta (sem recomputar!)
        const rankingVector = respCache[bestIntent];

        if (rankingVector) {
            const scored = currentSymbols.map(s => ({
                id: s.id,
                score: cosineSimilarity(rankingVector, s.vector),
                label: s.label
            }));

            rankedSymbols = scored
                .sort((a, b) => b.score - a.score)
                .filter(s => s.score > 0.15)
                .slice(0, 6);

            console.log(`[ContextWorker] ★ Intent=${bestIntent} | Top 5: ${rankedSymbols.slice(0, 5).map(s => `${s.label}(${s.score.toFixed(2)})`).join(', ')}`);
        } else {
            console.warn(`[ContextWorker] Sem conceito de resposta para ${bestIntent}`);
        }
    }

    self.postMessage({
        type: IA_EVENTS.CONTEXT.RESULT,
        payload: {
            intent: bestIntent,
            score: maxIntentScore,
            text: cleanText,
            rankedSymbols
        }
    });
};

// ============================================================
//  LOOP DE MENSAGENS
// ============================================================

self.onmessage = async (event) => {
    const { type, payload } = event.data;

    try {
        if (type === IA_EVENTS.CONTEXT.INIT) {
            const model = await getClassifier();
            await ensureConceptCache(model);
            await ensureResponseVectorCache(model);
            self.postMessage({ type: IA_EVENTS.CONTEXT.READY });
        }

        if (type === 'CONTEXT:GENERATE_SYMBOLS_CACHE') {
            const model = await getClassifier();
            await ensureSymbolCache(model, payload.symbols);
            self.postMessage({ type: 'CONTEXT:SYMBOLS_CACHE_READY' });

            // Processa análises que ficaram na fila esperando o cache
            if (pendingAnalysis.length > 0) {
                console.log(`[ContextWorker] Processando ${pendingAnalysis.length} análises pendentes...`);
                const pending = pendingAnalysis.splice(0);
                for (const t of pending) {
                    await runAnalysis(t);
                }
            }
        }

        if (type === IA_EVENTS.CONTEXT.ANALYZE) {
            if (!symbolCache || symbolCache.length === 0) {
                console.warn(`[ContextWorker] Cache não pronto — enfileirando: "${payload}"`);
                pendingAnalysis.push(payload);
                return;
            }
            await runAnalysis(payload);
        }

    } catch (err) {
        console.error('Semantic Engine Error:', err);
        self.postMessage({ type: IA_EVENTS.CONTEXT.ERROR, payload: err.message });
    }
};
