import React from 'react';
import {
    Utensils, Heart, Home, MessageCircle, AlertCircle, Smile, Frown, ThumbsUp, ThumbsDown, Battery, User, Star, Coffee, Bed, Bath,
    Hand, ArrowRight, Play, Eye, DoorOpen, Users, Search, MapPin, ArrowUpRight, Pointer, HeartHandshake, HelpCircle, Maximize2, Minimize2, Plus, XCircle
} from 'lucide-react';

export const QuoteSymbols = [
    // Sociais
    { id: 1, label: { pt: 'Olá', en: 'Hello', es: 'Hola' }, icon: <MessageCircle />, category: 'social', text: { pt: 'Olá', en: 'Hello', es: 'Hola' }, audio: 'ola.mp3' },
    { id: 3, label: { pt: 'Sim', en: 'Yes', es: 'Sí' }, icon: <ThumbsUp />, category: 'social', text: { pt: 'Sim', en: 'Yes', es: 'Sí' }, audio: 'sim.mp3' },
    { id: 4, label: { pt: 'Não', en: 'No', es: 'No' }, icon: <ThumbsDown />, category: 'social', text: { pt: 'Não', en: 'No', es: 'No' }, audio: 'nao.mp3' },
    { id: 13, label: { pt: 'Ajuda', icon: <HeartHandshake />, en: 'Help', es: 'Ayuda' }, icon: <HeartHandshake />, category: 'social', text: { pt: 'ajuda', en: 'help', es: 'ayuda' }, audio: 'ajuda.mp3' },
    { id: 14, label: { pt: 'Gostar', en: 'Like', es: 'Gustar' }, icon: <Heart />, category: 'social', text: { pt: 'gostar', en: 'like', es: 'gustar' }, audio: 'gostar.mp3' },
    { id: 15, label: { pt: 'O quê', en: 'What', es: 'Qué' }, icon: <HelpCircle />, category: 'social', text: { pt: 'o quê', en: 'what', es: 'qué' }, audio: 'o_que.mp3' },

    // Pessoas
    { id: 2, label: { pt: 'Eu', en: 'I', es: 'Yo' }, icon: <User />, category: 'people', text: { pt: 'Eu', en: 'I', es: 'Yo' }, audio: 'eu.mp3' },
    { id: 16, label: { pt: 'Você', en: 'You', es: 'Tú' }, icon: <Users />, category: 'people', text: { pt: 'você', en: 'you', es: 'tú' }, audio: 'voce.mp3' },
    { id: 17, label: { pt: 'Quem', en: 'Who', es: 'Quién' }, icon: <Search />, category: 'people', text: { pt: 'quem', en: 'who', es: 'quién' }, audio: 'quem.mp3' },

    // Ações (Verbs)
    { id: 18, label: { pt: 'Querer', en: 'Want', es: 'Querer' }, icon: <Hand />, category: 'verb', text: { pt: 'querer', en: 'want', es: 'querer' }, audio: 'querer.mp3' },
    { id: 5, label: { pt: 'Comer', en: 'Eat', es: 'Comer' }, icon: <Utensils />, category: 'verb', text: { pt: 'comer', en: 'eat', es: 'comer' }, audio: 'comer.mp3' },
    { id: 6, label: { pt: 'Beber', en: 'Drink', es: 'Beber' }, icon: <Coffee />, category: 'verb', text: { pt: 'beber', en: 'drink', es: 'beber' }, audio: 'beber.mp3' },
    { id: 19, label: { pt: 'Ir', en: 'Go', es: 'Ir' }, icon: <ArrowRight />, category: 'verb', text: { pt: 'ir', en: 'go', es: 'ir' }, audio: 'ir.mp3' },
    { id: 20, label: { pt: 'Fazer', en: 'Do', es: 'Hacer' }, icon: <Play />, category: 'verb', text: { pt: 'fazer', en: 'do', es: 'hacer' }, audio: 'fazer.mp3' },
    { id: 21, label: { pt: 'Ver', en: 'See', es: 'Ver' }, icon: <Eye />, category: 'verb', text: { pt: 'ver', en: 'see', es: 'ver' }, audio: 'ver.mp3' },
    { id: 22, label: { pt: 'Abrir', en: 'Open', es: 'Abrir' }, icon: <DoorOpen />, category: 'verb', text: { pt: 'abrir', en: 'open', es: 'abrir' }, audio: 'abrir.mp3' },
    { id: 8, label: { pt: 'Dormir', en: 'Sleep', es: 'Dormir' }, icon: <Bed />, category: 'verb', text: { pt: 'dormir', en: 'sleep', es: 'dormir' }, audio: 'dormir.mp3' },
    { id: 9, label: { pt: 'Brincar', en: 'Play', es: 'Jugar' }, icon: <Star />, category: 'verb', text: { pt: 'brincar', en: 'play', es: 'jugar' }, audio: 'brincar.mp3' },

    // Lugares / Espaço
    { id: 7, label: { pt: 'Banheiro', en: 'Bathroom', es: 'Baño' }, icon: <Bath />, category: 'noun', text: { pt: 'banheiro', en: 'bathroom', es: 'baño' }, audio: 'banheiro.mp3' },
    { id: 23, label: { pt: 'Aqui', en: 'Here', es: 'Aquí' }, icon: <MapPin />, category: 'adj', text: { pt: 'aqui', en: 'here', es: 'aquí' }, audio: 'aqui.mp3' },
    { id: 24, label: { pt: 'Lá', en: 'There', es: 'Allí' }, icon: <ArrowUpRight />, category: 'adj', text: { pt: 'lá', en: 'there', es: 'allí' }, audio: 'la.mp3' },
    { id: 25, label: { pt: 'Isso', en: 'This', es: 'Eso' }, icon: <Pointer />, category: 'adj', text: { pt: 'isso', en: 'this', es: 'eso' }, audio: 'isso.mp3' },

    // Qualidades / Descritivos
    { id: 26, label: { pt: 'Grande', en: 'Big', es: 'Grande' }, icon: <Maximize2 />, category: 'adj', text: { pt: 'grande', en: 'big', es: 'grande' }, audio: 'grande.mp3' },
    { id: 27, label: { pt: 'Pequeno', en: 'Small', es: 'Pequeño' }, icon: <Minimize2 />, category: 'adj', text: { pt: 'pequeno', en: 'small', es: 'pequeño' }, audio: 'pequeno.mp3' },
    { id: 28, label: { pt: 'Mais', en: 'More', es: 'Más' }, icon: <Plus />, category: 'adj', text: { pt: 'mais', en: 'more', es: 'más' }, audio: 'mais.mp3' },
    { id: 29, label: { pt: 'Acabou', en: 'Finished', es: 'Acabó' }, icon: <XCircle />, category: 'adj', text: { pt: 'acabou', en: 'finished', es: 'acabó' }, audio: 'acabou.mp3' },
    { id: 10, label: { pt: 'Feliz', en: 'Happy', es: 'Feliz' }, icon: <Smile />, category: 'adj', text: { pt: 'feliz', en: 'happy', es: 'feliz' }, audio: 'feliz.mp3' },
    { id: 11, label: { pt: 'Triste', en: 'Sad', es: 'Triste' }, icon: <Frown />, category: 'adj', text: { pt: 'triste', en: 'sad', es: 'triste' }, audio: 'triste.mp3' },
    { id: 12, label: { pt: 'Dor', en: 'Pain', es: 'Dolor' }, icon: <AlertCircle />, category: 'adj', text: { pt: 'dor', en: 'pain', es: 'dolor' }, audio: 'dor.mp3' },
];
