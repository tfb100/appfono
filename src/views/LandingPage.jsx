import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MessageCircle, Heart, Brain, ArrowRight } from 'lucide-react';
import logoKids from '../assets/logo-kids.png';
import '../styles/main.css';

const LandingPage = () => {
    const navigate = useNavigate();

    // Orange Palette Definition
    const theme = {
        primary: '#F48C06', // Vivid Orange
        secondary: '#DC2F02', // Orange Red
        bg: '#FFF8F0', // Very Light Orange/Cream
        text: '#370617', // Dark Red/Brown
        cardBg: '#FFFFFF',
        accent: '#FFBA08' // Yellow/Orange
    };

    return (
        <div className="landing-container" style={{ backgroundColor: theme.bg, minHeight: '100vh', color: theme.text, fontFamily: 'var(--font-base)' }}>
            <Helmet>
                <title>Comunica+ | Comunicação que Aproxima</title>
                <meta name="description" content="Ferramenta gratuita de Comunicação Aumentativa e Alternativa (CAA) para apoiar o desenvolvimento da fala e a interação social." />
                <meta name="theme-color" content="#F48C06" />
            </Helmet>

            {/* Global Animations Style */}
            <style>
                {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
          .hover-lift { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .hover-lift:hover { transform: translateY(-8px) scale(1.02); }
        `}
            </style>

            {/* Navbar */}
            <nav style={{
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1200px',
                margin: '0rem auto 0',
                flexWrap: 'wrap',
                gap: '1rem',
                backgroundColor: '#FFF8F0', // Blends with Hero
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="animate-fade-in">
                    <img src={logoKids} alt="Comunica+ Logo" style={{ height: '90px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
                </div>
                <button
                    onClick={() => navigate('/app')}
                    className="animate-fade-in"
                    style={{
                        backgroundColor: theme.primary,
                        color: '#FFF',
                        padding: '0.8rem 1.8rem',
                        borderRadius: '2rem',
                        fontWeight: 'bold',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 10px rgba(244, 140, 6, 0.3)',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        animationDelay: '0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 15px rgba(244, 140, 6, 0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 10px rgba(244, 140, 6, 0.3)';
                    }}
                >
                    Acessar App <ArrowRight size={20} />
                </button>
            </nav>

            {/* Hero Section */}
            <header style={{
                textAlign: 'center',
                padding: '6rem 1rem',
                background: `radial-gradient(circle at center, ${theme.accent}20 0%, transparent 70%)`,
                position: 'relative'
            }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h1 className="animate-fade-in" style={{
                        fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                        marginBottom: '1.5rem',
                        lineHeight: '1.1',
                        color: theme.text,
                        fontWeight: '900',
                        letterSpacing: '-0.02em',
                        animationDelay: '0.3s'
                    }}>
                        Comunicação que <span style={{ color: theme.secondary, position: 'relative', display: 'inline-block' }}>
                            Aproxima
                            <svg width="100%" height="15" viewBox="0 0 100 15" preserveAspectRatio="none" style={{ position: 'absolute', bottom: '0px', left: 0, zIndex: -1, opacity: 0.8 }}>
                                <path d="M0 10 Q 50 15 100 5" stroke={theme.accent} strokeWidth="10" fill="none" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h1>
                    <p className="animate-fade-in" style={{
                        fontSize: '1.35rem',
                        marginBottom: '3rem',
                        opacity: 0.9,
                        maxWidth: '700px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        lineHeight: '1.6',
                        fontWeight: '500',
                        animationDelay: '0.5s'
                    }}>
                        Ferramenta gratuita de Comunicação Aumentativa e Alternativa (CAA) para apoiar o desenvolvimento da fala e a interação social.
                    </p>
                    <button
                        onClick={() => navigate('/app')}
                        className="animate-fade-in"
                        style={{
                            backgroundColor: theme.secondary,
                            color: '#fff',
                            padding: '1.2rem 3.5rem',
                            borderRadius: '3rem',
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            border: 'none',
                            boxShadow: `0 10px 25px ${theme.secondary}60`,
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            cursor: 'pointer',
                            animationDelay: '0.7s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05) translateY(-3px)';
                            e.currentTarget.style.boxShadow = `0 15px 35px ${theme.secondary}80`;
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1) translateY(0)';
                            e.currentTarget.style.boxShadow = `0 10px 25px ${theme.secondary}60`;
                        }}
                    >
                        Começar Agora
                    </button>
                </div>
            </header>

            {/* Features / Info Section */}
            <section style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2.5rem'
                }}>
                    {/* Card 1: Fono */}
                    <div
                        className="info-card hover-lift animate-fade-in"
                        style={{
                            backgroundColor: theme.cardBg,
                            padding: '3rem',
                            borderRadius: '2.5rem',
                            color: theme.text,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            border: `1px solid ${theme.bg}`,
                            position: 'relative',
                            overflow: 'hidden',
                            animationDelay: '0.9s'
                        }}
                    >
                        <div style={{
                            backgroundColor: '#FFECD1',
                            width: '70px', height: '70px',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '2rem',
                            color: theme.secondary
                        }}>
                            <Brain size={36} />
                        </div>
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: '800' }}>Fonoaudiologia</h3>
                        <p style={{ lineHeight: '1.7', fontSize: '1.1rem', opacity: 0.9 }}>
                            Apoio essencial para terapias, facilitando a expressão e compreensão de crianças e adultos com dificuldades de comunicação.
                        </p>
                    </div>

                    {/* Card 2: CAA */}
                    <div
                        className="info-card hover-lift animate-fade-in"
                        style={{
                            backgroundColor: theme.cardBg,
                            padding: '3rem',
                            borderRadius: '2.5rem',
                            color: theme.text,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            border: `1px solid ${theme.bg}`,
                            position: 'relative',
                            overflow: 'hidden',
                            animationDelay: '1.1s'
                        }}
                    >
                        <div style={{
                            backgroundColor: '#FFE5D9',
                            width: '70px', height: '70px',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '2rem',
                            color: theme.secondary
                        }}>
                            <MessageCircle size={36} />
                        </div>
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: '800' }}>O que é CAA?</h3>
                        <p style={{ lineHeight: '1.7', fontSize: '1.1rem', opacity: 0.9 }}>
                            Comunicação Aumentativa e Alternativa engloba métodos que complementam ou substituem a fala, promovendo autonomia.
                        </p>
                    </div>

                    {/* Card 3: Everyone */}
                    <div
                        className="info-card hover-lift animate-fade-in"
                        style={{
                            backgroundColor: theme.cardBg,
                            padding: '3rem',
                            borderRadius: '2.5rem',
                            color: theme.text,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            border: `1px solid ${theme.bg}`,
                            position: 'relative',
                            overflow: 'hidden',
                            animationDelay: '1.3s'
                        }}
                    >
                        <div style={{
                            backgroundColor: '#E8E8E4',
                            width: '70px', height: '70px',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '2rem',
                            color: theme.secondary
                        }}>
                            <Heart size={36} />
                        </div>
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: '800' }}>Para Todos</h3>
                        <p style={{ lineHeight: '1.7', fontSize: '1.1rem', opacity: 0.9 }}>
                            Desenvolvido com carinho para famílias, cuidadores e profissionais. Simples, intuitivo e gratuito.
                        </p>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section style={{
                padding: '4rem 1rem',
                backgroundColor: '#FFE5D9', // Soft orange background
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: theme.text, fontWeight: '800' }}>
                        Fique por dentro das novidades!
                    </h2>
                    <p style={{ marginBottom: '2rem', fontSize: '1.1rem', opacity: 0.9 }}>
                        Cadastre-se para receber atualizações, dicas de uso e novos recursos do Comunica+.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <input
                            type="email"
                            placeholder="Seu melhor e-mail"
                            style={{
                                padding: '1rem 1.5rem',
                                borderRadius: '2rem',
                                border: 'none',
                                outline: 'none',
                                flex: '1',
                                minWidth: '250px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                fontSize: '1rem'
                            }}
                        />
                        <button style={{
                            backgroundColor: theme.primary,
                            color: '#FFF',
                            padding: '1rem 2rem',
                            borderRadius: '2rem',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: `0 4px 10px ${theme.primary}40`,
                            transition: 'transform 0.2s',
                            fontSize: '1rem'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Cadastrar
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                backgroundColor: '#370617', // Dark contrast footer
                color: '#FFF',
                marginTop: '0'
            }}>
                <div style={{ marginBottom: '2rem' }}>
                    <img src={logoKids} alt="Comunica+ Logo" style={{ height: '70px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                </div>
                <p style={{ opacity: 0.9, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    © 2026 - Comunica+ feito para ajudar.
                </p>
                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                    Comunica+ faz parte do grupo <a href="https://oqconecta.com.br" target="_blank" rel="noopener noreferrer" style={{ color: theme.primary, textDecoration: 'none', fontWeight: 'bold' }}>OQConecta.com.br</a>
                </p>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.9rem', opacity: 0.6 }}>
                    <span style={{ cursor: 'pointer', borderBottom: '1px solid transparent' }} onMouseOver={(e) => e.currentTarget.style.borderBottomColor = 'white'} onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>Política de Privacidade</span>
                    <span style={{ cursor: 'pointer', borderBottom: '1px solid transparent' }} onMouseOver={(e) => e.currentTarget.style.borderBottomColor = 'white'} onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>Termos de Uso</span>
                    <span style={{ cursor: 'pointer', borderBottom: '1px solid transparent' }} onMouseOver={(e) => e.currentTarget.style.borderBottomColor = 'white'} onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>Contato</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
