import React from 'react';
import {
    Utensils, Heart, Home, MessageCircle, AlertCircle, Smile, Frown, ThumbsUp, ThumbsDown, Battery, User, Star, Coffee, Bed, Bath,
    Hand, ArrowRight, Play, Eye, DoorOpen, Users, Search, MapPin, ArrowUpRight, Pointer, HeartHandshake, HelpCircle, Maximize2, Minimize2, Plus, XCircle
} from 'lucide-react';

export const QuoteSymbols = [
    // Sociais
    { id: 1, label: 'Olá', icon: <MessageCircle />, category: 'social', text: 'Olá' },
    { id: 3, label: 'Sim', icon: <ThumbsUp />, category: 'social', text: 'Sim' },
    { id: 4, label: 'Não', icon: <ThumbsDown />, category: 'social', text: 'Não' },
    { id: 13, label: 'Ajuda', icon: <HeartHandshake />, category: 'social', text: 'ajuda' },
    { id: 14, label: 'Gostar', icon: <Heart />, category: 'social', text: 'gostar' },
    { id: 15, label: 'O quê', icon: <HelpCircle />, category: 'social', text: 'o quê' },

    // Pessoas
    { id: 2, label: 'Eu', icon: <User />, category: 'people', text: 'Eu' },
    { id: 16, label: 'Você', icon: <Users />, category: 'people', text: 'você' },
    { id: 17, label: 'Quem', icon: <Search />, category: 'people', text: 'quem' },

    // Ações (Verbs)
    { id: 18, label: 'Querer', icon: <Hand />, category: 'verb', text: 'querer' },
    { id: 5, label: 'Comer', icon: <Utensils />, category: 'verb', text: 'comer' },
    { id: 6, label: 'Beber', icon: <Coffee />, category: 'verb', text: 'beber' },
    { id: 19, label: 'Ir', icon: <ArrowRight />, category: 'verb', text: 'ir' },
    { id: 20, label: 'Fazer', icon: <Play />, category: 'verb', text: 'fazer' },
    { id: 21, label: 'Ver', icon: <Eye />, category: 'verb', text: 'ver' },
    { id: 22, label: 'Abrir', icon: <DoorOpen />, category: 'verb', text: 'abrir' },
    { id: 8, label: 'Dormir', icon: <Bed />, category: 'verb', text: 'dormir' },
    { id: 9, label: 'Brincar', icon: <Star />, category: 'verb', text: 'brincar' },

    // Lugares / Espaço
    { id: 7, label: 'Banheiro', icon: <Bath />, category: 'noun', text: 'banheiro' },
    { id: 23, label: 'Aqui', icon: <MapPin />, category: 'adj', text: 'aqui' },
    { id: 24, label: 'Lá', icon: <ArrowUpRight />, category: 'adj', text: 'lá' },
    { id: 25, label: 'Isso', icon: <Pointer />, category: 'adj', text: 'isso' },

    // Qualidades / Descritivos
    { id: 26, label: 'Grande', icon: <Maximize2 />, category: 'adj', text: 'grande' },
    { id: 27, label: 'Pequeno', icon: <Minimize2 />, category: 'adj', text: 'pequeno' },
    { id: 28, label: 'Mais', icon: <Plus />, category: 'adj', text: 'mais' },
    { id: 29, label: 'Acabou', icon: <XCircle />, category: 'adj', text: 'acabou' },
    { id: 10, label: 'Feliz', icon: <Smile />, category: 'adj', text: 'feliz' },
    { id: 11, label: 'Triste', icon: <Frown />, category: 'adj', text: 'triste' },
    { id: 12, label: 'Dor', icon: <AlertCircle />, category: 'adj', text: 'dor' },
];
