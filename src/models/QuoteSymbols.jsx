import React from 'react';
import {
    Utensils, Heart, Home, MessageCircle, AlertCircle, Smile, Frown, ThumbsUp, ThumbsDown, Battery, User, Star, Coffee, Bed, Bath,
    Hand, ArrowRight, Play, Eye, DoorOpen, Users, Search, MapPin, ArrowUpRight, Pointer, HeartHandshake, HelpCircle, Maximize2, Minimize2, Plus, XCircle
} from 'lucide-react';

export const QuoteSymbols = [
    // Sociais
    { id: 1, label: 'Olá', icon: <MessageCircle />, category: 'social', text: 'Olá', audio: 'ola.mp3' },
    { id: 3, label: 'Sim', icon: <ThumbsUp />, category: 'social', text: 'Sim', audio: 'sim.mp3' },
    { id: 4, label: 'Não', icon: <ThumbsDown />, category: 'social', text: 'Não', audio: 'nao.mp3' },
    { id: 13, label: 'Ajuda', icon: <HeartHandshake />, category: 'social', text: 'ajuda', audio: 'ajuda.mp3' },
    { id: 14, label: 'Gostar', icon: <Heart />, category: 'social', text: 'gostar', audio: 'gostar.mp3' },
    { id: 15, label: 'O quê', icon: <HelpCircle />, category: 'social', text: 'o quê', audio: 'o_que.mp3' },

    // Pessoas
    { id: 2, label: 'Eu', icon: <User />, category: 'people', text: 'Eu', audio: 'eu.mp3' },
    { id: 16, label: 'Você', icon: <Users />, category: 'people', text: 'você', audio: 'voce.mp3' },
    { id: 17, label: 'Quem', icon: <Search />, category: 'people', text: 'quem', audio: 'quem.mp3' },

    // Ações (Verbs)
    { id: 18, label: 'Querer', icon: <Hand />, category: 'verb', text: 'querer', audio: 'querer.mp3' },
    { id: 5, label: 'Comer', icon: <Utensils />, category: 'verb', text: 'comer', audio: 'comer.mp3' },
    { id: 6, label: 'Beber', icon: <Coffee />, category: 'verb', text: 'beber', audio: 'beber.mp3' },
    { id: 19, label: 'Ir', icon: <ArrowRight />, category: 'verb', text: 'ir', audio: 'ir.mp3' },
    { id: 20, label: 'Fazer', icon: <Play />, category: 'verb', text: 'fazer', audio: 'fazer.mp3' },
    { id: 21, label: 'Ver', icon: <Eye />, category: 'verb', text: 'ver', audio: 'ver.mp3' },
    { id: 22, label: 'Abrir', icon: <DoorOpen />, category: 'verb', text: 'abrir', audio: 'abrir.mp3' },
    { id: 8, label: 'Dormir', icon: <Bed />, category: 'verb', text: 'dormir', audio: 'dormir.mp3' },
    { id: 9, label: 'Brincar', icon: <Star />, category: 'verb', text: 'brincar', audio: 'brincar.mp3' },

    // Lugares / Espaço
    { id: 7, label: 'Banheiro', icon: <Bath />, category: 'noun', text: 'banheiro', audio: 'banheiro.mp3' },
    { id: 23, label: 'Aqui', icon: <MapPin />, category: 'adj', text: 'aqui', audio: 'aqui.mp3' },
    { id: 24, label: 'Lá', icon: <ArrowUpRight />, category: 'adj', text: 'lá', audio: 'la.mp3' },
    { id: 25, label: 'Isso', icon: <Pointer />, category: 'adj', text: 'isso', audio: 'isso.mp3' },

    // Qualidades / Descritivos
    { id: 26, label: 'Grande', icon: <Maximize2 />, category: 'adj', text: 'grande', audio: 'grande.mp3' },
    { id: 27, label: 'Pequeno', icon: <Minimize2 />, category: 'adj', text: 'pequeno', audio: 'pequeno.mp3' },
    { id: 28, label: 'Mais', icon: <Plus />, category: 'adj', text: 'mais', audio: 'mais.mp3' },
    { id: 29, label: 'Acabou', icon: <XCircle />, category: 'adj', text: 'acabou', audio: 'acabou.mp3' },
    { id: 10, label: 'Feliz', icon: <Smile />, category: 'adj', text: 'feliz', audio: 'feliz.mp3' },
    { id: 11, label: 'Triste', icon: <Frown />, category: 'adj', text: 'triste', audio: 'triste.mp3' },
    { id: 12, label: 'Dor', icon: <AlertCircle />, category: 'adj', text: 'dor', audio: 'dor.mp3' },
];
