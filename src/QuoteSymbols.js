import React from 'react';
import { Utensils, Heart, Home, MessageCircle, AlertCircle, Smile, Frown, ThumbsUp, ThumbsDown, Battery, User, Star, Coffee, Bed, Bath } from 'lucide-react';

export const QuoteSymbols = [
    { id: 1, label: 'Olá', icon: <MessageCircle />, category: 'social', text: 'Olá, tudo bem?' },
    { id: 2, label: 'Eu', icon: <User />, category: 'people', text: 'Eu' },
    { id: 3, label: 'Sim', icon: <ThumbsUp />, category: 'social', text: 'Sim' },
    { id: 4, label: 'Não', icon: <ThumbsDown />, category: 'social', text: 'Não' },
    { id: 5, label: 'Comer', icon: <Utensils />, category: 'verb', text: 'Quero comer' },
    { id: 6, label: 'Beber', icon: <Coffee />, category: 'verb', text: 'Quero beber' },
    { id: 7, label: 'Banheiro', icon: <Bath />, category: 'noun', text: 'Preciso ir ao banheiro' },
    { id: 8, label: 'Dormir', icon: <Bed />, category: 'verb', text: 'Quero dormir' },
    { id: 9, label: 'Brincar', icon: <Star />, category: 'verb', text: 'Quero brincar' },
    { id: 10, label: 'Feliz', icon: <Smile />, category: 'adj', text: 'Estou feliz' },
    { id: 11, label: 'Triste', icon: <Frown />, category: 'adj', text: 'Estou triste' },
    { id: 12, label: 'Dor', icon: <AlertCircle />, category: 'adj', text: 'Estou com dor' },
];
