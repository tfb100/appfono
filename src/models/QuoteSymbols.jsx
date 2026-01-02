import React from 'react';
import {
    Utensils, Heart, Home, MessageCircle, AlertCircle, Smile, Frown, ThumbsUp, ThumbsDown, Battery, User, Star, Coffee, Bed, Bath,
    Hand, ArrowRight, Play, Eye, DoorOpen, Users, Search, MapPin, ArrowUpRight, Pointer, HeartHandshake, HelpCircle, Maximize2, Minimize2, Plus, XCircle,
    Tv, Trees, Sofa, Moon, BatteryLow, Fingerprint, Activity, DoorClosed, Trophy, TrendingDown, Sun, CloudSun
} from 'lucide-react';

export const QuoteSymbols = [
    // Sociais
    { id: 1, label: { pt: 'Olá', en: 'Hello', es: 'Hola' }, icon: <MessageCircle />, colorfulIcon: 'ola.png', category: 'social', text: { pt: 'Olá', en: 'Hello', es: 'Hola' }, audio: 'ola.mp3' },
    { id: 3, label: { pt: 'Sim', en: 'Yes', es: 'Sí' }, icon: <ThumbsUp />, colorfulIcon: 'sim.png', category: 'social', text: { pt: 'Sim', en: 'Yes', es: 'Sí' }, audio: 'sim.mp3' },
    { id: 4, label: { pt: 'Não', en: 'No', es: 'No' }, icon: <ThumbsDown />, colorfulIcon: 'nao.png', category: 'social', text: { pt: 'Não', en: 'No', es: 'No' }, audio: 'nao.mp3' },
    { id: 13, label: { pt: 'Ajuda', icon: <HeartHandshake />, en: 'Help', es: 'Ayuda' }, icon: <HeartHandshake />, colorfulIcon: 'ajuda.png', category: 'social', text: { pt: 'ajuda', en: 'help', es: 'ayuda' }, audio: 'ajuda.mp3' },
    { id: 15, label: { pt: 'Por quê?', en: 'Why?', es: '¿Por qué?' }, icon: <HelpCircle />, colorfulIcon: 'o_que.png', category: 'social', text: { pt: 'por quê', en: 'why', es: 'por qué' }, audio: 'por quê?' },
    { id: 46, label: { pt: 'Bom dia', en: 'Good morning', es: 'Buenos días' }, icon: <Sun />, category: 'social', text: { pt: 'bom dia', en: 'good morning', es: 'buenos días' }, audio: 'bom_dia.mp3' },
    { id: 47, label: { pt: 'Boa tarde', en: 'Good afternoon', es: 'Buenas tardes' }, icon: <CloudSun />, category: 'social', text: { pt: 'boa tarde', en: 'good afternoon', es: 'buenas tardes' }, audio: 'boa_tarde.mp3' },
    { id: 48, label: { pt: 'Boa noite', en: 'Good night', es: 'Buenas noches' }, icon: <Moon />, category: 'social', text: { pt: 'boa noite', en: 'good night', es: 'buenas noches' }, audio: 'boa_noite.mp3' },
    { id: 49, label: { pt: 'Tchau', en: 'Goodbye', es: 'Adiós' }, icon: <Hand />, category: 'social', text: { pt: 'tchau', en: 'goodbye', es: 'adiós' }, audio: 'tchau.mp3' },

    // Pessoas
    { id: 2, label: { pt: 'Eu', en: 'I', es: 'Yo' }, icon: <User />, colorfulIcon: 'eu.png', category: 'people', text: { pt: 'Eu', en: 'I', es: 'Yo' }, audio: 'eu.mp3' },
    { id: 16, label: { pt: 'Você', en: 'You', es: 'Tú' }, icon: <Users />, colorfulIcon: 'voce.png', category: 'people', text: { pt: 'você', en: 'you', es: 'tú' }, audio: 'voce.mp3' },
    { id: 17, label: { pt: 'Quem', en: 'Who', es: 'Quién' }, icon: <Search />, colorfulIcon: 'quem.png', category: 'people', text: { pt: 'quem', en: 'who', es: 'quién' }, audio: 'quem.mp3' },
    { id: 42, label: { pt: 'Mamãe', en: 'Mom', es: 'Mamá' }, icon: <User />, category: 'people', text: { pt: 'mamãe', en: 'mom', es: 'mamá' }, audio: 'mamae.mp3' },
    { id: 43, label: { pt: 'Papai', en: 'Dad', es: 'Papá' }, icon: <User />, category: 'people', text: { pt: 'papai', en: 'dad', es: 'papá' }, audio: 'papai.mp3' },
    { id: 44, label: { pt: 'Vovô', en: 'Grandpa', es: 'Abuelo' }, icon: <User />, category: 'people', text: { pt: 'vovô', en: 'grandpa', es: 'abuelo' }, audio: 'vovo_m.mp3' },
    { id: 45, label: { pt: 'Vovó', en: 'Grandma', es: 'Abuela' }, icon: <User />, category: 'people', text: { pt: 'vovó', en: 'grandma', es: 'abuela' }, audio: 'vovo_f.mp3' },

    // Ações (Verbs)
    { id: 18, label: { pt: 'Querer', en: 'Want', es: 'Querer' }, icon: <Hand />, colorfulIcon: 'querer.png', category: 'verb', text: { pt: 'querer', en: 'want', es: 'querer' }, audio: 'querer.mp3' },
    { id: 14, label: { pt: 'Gostar', en: 'Like', es: 'Gustar' }, icon: <Heart />, colorfulIcon: 'gostar.png', category: 'verb', text: { pt: 'gostar', en: 'like', es: 'gustar' }, audio: 'gostar.mp3' },
    { id: 5, label: { pt: 'Comer', en: 'Eat', es: 'Comer' }, icon: <Utensils />, category: 'verb', text: { pt: 'comer', en: 'eat', es: 'comer' }, audio: 'comer.mp3' },
    { id: 6, label: { pt: 'Beber', en: 'Drink', es: 'Beber' }, icon: <Coffee />, colorfulIcon: 'beber.png', category: 'verb', text: { pt: 'beber', en: 'drink', es: 'beber' }, audio: 'beber.mp3' },
    { id: 19, label: { pt: 'Ir', en: 'Go', es: 'Ir' }, icon: <ArrowRight />, colorfulIcon: 'ir.png', category: 'verb', text: { pt: 'ir', en: 'go', es: 'ir' }, audio: 'ir.mp3' },
    { id: 20, label: { pt: 'Fazer', en: 'Do', es: 'Hacer' }, icon: <Play />, colorfulIcon: 'fazer.png', category: 'verb', text: { pt: 'fazer', en: 'do', es: 'hacer' }, audio: 'fazer.mp3' },
    { id: 21, label: { pt: 'Ver', en: 'See', es: 'Ver' }, icon: <Eye />, colorfulIcon: 'ver.png', category: 'verb', text: { pt: 'ver', en: 'see', es: 'ver' }, audio: 'ver.mp3' },
    { id: 22, label: { pt: 'Abrir', en: 'Open', es: 'Abrir' }, icon: <DoorOpen />, category: 'verb', text: { pt: 'abrir', en: 'open', es: 'abrir' }, audio: 'abrir.mp3' },
    { id: 8, label: { pt: 'Dormir', en: 'Sleep', es: 'Dormir' }, icon: <Bed />, category: 'verb', text: { pt: 'dormir', en: 'sleep', es: 'dormir' }, audio: 'dormir.mp3' },
    { id: 9, label: { pt: 'Brincar', en: 'Play', es: 'Jugar' }, icon: <Star />, category: 'verb', text: { pt: 'brincar', en: 'play', es: 'jugar' }, audio: 'brincar.mp3' },
    { id: 37, label: { pt: 'Sou', en: 'I am', es: 'Soy' }, icon: <Fingerprint />, category: 'verb', text: { pt: 'sou', en: 'i am', es: 'soy' }, audio: 'sou.mp3' },
    { id: 38, label: { pt: 'Estou', en: 'I am (state)', es: 'Estoy' }, icon: <Activity />, category: 'verb', text: { pt: 'estou', en: 'i am', es: 'estoy' }, audio: 'estou.mp3' },
    { id: 39, label: { pt: 'Fechar', en: 'Close', es: 'Cerrar' }, icon: <DoorClosed />, category: 'verb', text: { pt: 'fechar', en: 'close', es: 'cerrar' }, audio: 'fechar.mp3' },
    { id: 40, label: { pt: 'Ganhei', en: 'I won', es: 'Gané' }, icon: <Trophy />, category: 'verb', text: { pt: 'ganhei', en: 'i won', es: 'gané' }, audio: 'ganhei.mp3' },
    { id: 41, label: { pt: 'Perdi', en: 'I lost', es: 'Perdí' }, icon: <TrendingDown />, category: 'verb', text: { pt: 'perdi', en: 'i lost', es: 'perdí' }, audio: 'perdi.mp3' },

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
    // Sentimentos
    { id: 10, label: { pt: 'Feliz', en: 'Happy', es: 'Feliz' }, icon: <Smile />, category: 'feelings', text: { pt: 'feliz', en: 'happy', es: 'feliz' }, audio: 'feliz.mp3' },
    { id: 11, label: { pt: 'Triste', en: 'Sad', es: 'Triste' }, icon: <Frown />, category: 'feelings', text: { pt: 'triste', en: 'sad', es: 'triste' }, audio: 'triste.mp3' },
    { id: 12, label: { pt: 'Dor', en: 'Pain', es: 'Dolor' }, icon: <AlertCircle />, category: 'feelings', text: { pt: 'dor', en: 'pain', es: 'dolor' }, audio: 'dor.mp3' },
    { id: 35, label: { pt: 'Sono', en: 'Sleepy', es: 'Sueño' }, icon: <Moon />, category: 'feelings', text: { pt: 'sono', en: 'sleepy', es: 'sueño' }, audio: 'sono.mp3' },
    { id: 36, label: { pt: 'Cansado', en: 'Tired', es: 'Cansado' }, icon: <BatteryLow />, category: 'feelings', text: { pt: 'cansado', en: 'tired', es: 'cansado' }, audio: 'cansado.mp3' },

    // Lugares Adicionais
    { id: 30, label: { pt: 'Casa', en: 'Home', es: 'Casa' }, icon: <Home />, category: 'noun', text: { pt: 'casa', en: 'home', es: 'casa' }, audio: 'casa.mp3' },
    { id: 31, label: { pt: 'Cozinha', en: 'Kitchen', es: 'Cocina' }, icon: <Utensils />, category: 'noun', text: { pt: 'cozinha', en: 'kitchen', es: 'cocina' }, audio: 'cozinha.mp3' },
    { id: 32, label: { pt: 'Quarto', en: 'Bedroom', es: 'Habitación' }, icon: <Bed />, category: 'noun', text: { pt: 'quarto', en: 'bedroom', es: 'habitación' }, audio: 'quarto.mp3' },
    { id: 33, label: { pt: 'Sala', en: 'Living Room', es: 'Sala' }, icon: <Tv />, category: 'noun', text: { pt: 'sala', en: 'living room', es: 'sala' }, audio: 'sala.mp3' },
    { id: 34, label: { pt: 'Pátio', en: 'Yard', es: 'Patio' }, icon: <Trees />, category: 'noun', text: { pt: 'pátio', en: 'yard', es: 'patio' }, audio: 'patio.mp3' },
];
