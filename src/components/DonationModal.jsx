import React, { useMemo } from 'react';
import { X, Heart, Copy, Check } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { translations } from '../utils/translations';
import { useBilling } from '../hooks/useBilling';
import pixPayload from 'pix-payload';

const DonationModal = ({ isOpen, onClose, language = 'pt' }) => {
    const [selectedValue, setSelectedValue] = React.useState('medium');
    const [isMonthly, setIsMonthly] = React.useState(true);
    const [copied, setCopied] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('pix'); // Added activeTab state
    const [statusMessage, setStatusMessage] = React.useState(''); // Feedback message state

    // Billing Hook
    const { purchase, isAvailable, getProduct, debugError } = useBilling();

    const handleCopy = () => {
        navigator.clipboard.writeText('appcomunicamais@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const t = translations[language] || translations['pt'];

    const SUGGESTED_VALUES = useMemo(() => [
        {
            id: 'small',
            value: 5,
            label: isAvailable && getProduct('donation_small') ? getProduct('donation_small').price : t.donationValueLabelSmall,
            btnText: t.donationValueBtnSmall,
            impact: t.donationValueImpactSmall,
            productId: 'donation_small'
        },
        {
            id: 'medium',
            value: 10,
            label: isAvailable && getProduct('donation_medium') ? getProduct('donation_medium').price : t.donationValueLabelMedium,
            btnText: t.donationValueBtnMedium,
            impact: t.donationValueImpactMedium,
            productId: 'donation_medium'
        },
        {
            id: 'large',
            value: 20,
            label: isAvailable && getProduct('donation_large') ? getProduct('donation_large').price : t.donationValueLabelLarge,
            btnText: t.donationValueBtnLarge,
            impact: t.donationValueImpactLarge,
            productId: 'donation_large'
        },
        {
            id: 'custom',
            value: 0,
            label: t.donationValueLabelCustom,
            btnText: t.donationValueBtnCustom,
            impact: t.donationValueImpactCustom
        }
    ], [t, isAvailable, getProduct]); // Added isAvailable and getProduct to deps

    if (!isOpen) return null;

    const currentSelection = SUGGESTED_VALUES.find(v => v.id === selectedValue);

    // Safety check for help item split
    const getHelpItem = (text) => {
        if (!text) return "";
        const parts = text.split(':');
        return parts.length > 1 ? parts[1] : text;
    };

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-modal donation-modal-container" onClick={e => e.stopPropagation()}>
                <div className="settings-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Heart fill="#ef4444" color="#ef4444" size={24} />
                        <h2>{t?.donationTitle || 'Apoie'}</h2>
                    </div>
                    <button onClick={onClose} className="close-btn" aria-label={t?.close || 'Close'}>
                        <X size={24} />
                    </button>
                </div>

                <div className="donation-tabs" style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '16px' }}>
                    <button
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'pix' ? '3px solid #ffb703' : '3px solid transparent',
                            fontWeight: activeTab === 'pix' ? 'bold' : 'normal',
                            color: activeTab === 'pix' ? '#333' : '#888',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                        onClick={() => setActiveTab('pix')}
                    >
                        PIX
                    </button>
                    <button
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'google' ? '3px solid #ffb703' : '3px solid transparent',
                            fontWeight: activeTab === 'google' ? 'bold' : 'normal',
                            color: activeTab === 'google' ? '#333' : '#888',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                        onClick={() => setActiveTab('google')}
                    >
                        Google Play
                    </button>
                </div>

                <div className="settings-body donation-body">
                    <p className="donation-intro">
                        {t.donationIntro}
                    </p>

                    <h3 className="donation-subtitle" style={{ marginTop: 0 }}>{t.donationHelpTitle}</h3>
                    {/* Safe help text - Dynamic based on selection */}
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '16px', minHeight: '40px' }}>
                        {currentSelection?.impact || t.donationHelpItem1}
                    </p>


                    <h3 className="donation-subtitle">{t.donationSelectValue}</h3>

                    <div className="donation-values-grid">
                        {SUGGESTED_VALUES.map(option => (
                            <button
                                key={option.id}
                                className={`value-btn ${selectedValue === option.id ? 'selected' : ''}`}
                                onClick={() => setSelectedValue(option.id)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {/* Google Play Specific Content */}
                    {activeTab === 'google' && (
                        <>
                            <div className="recurrence-container">
                                <label className="recurrence-toggle">
                                    <input
                                        type="checkbox"
                                        checked={isMonthly}
                                        onChange={(e) => setIsMonthly(e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                    <span className="toggle-label">{t.donationMonthlyToggle}</span>
                                </label>
                            </div>

                            <button
                                className="primary-donate-btn"
                                onClick={() => {
                                    if (isAvailable && currentSelection?.productId) {
                                        purchase(currentSelection.productId);
                                        setStatusMessage('');
                                    } else {
                                        // Specific debugging message
                                        const message = debugError && debugError !== "Plataforma não nativa (Web/Dev)"
                                            ? `⚠️ Erro Google Play: ${debugError}`
                                            : "⚠️ Ambiente de Desenvolvimento: Compra Google Play indisponível (Simulação).";

                                        setStatusMessage(message);
                                        console.log("Purchase attempt failed:", debugError);
                                        // clear message after a few seconds
                                        setTimeout(() => setStatusMessage(''), 6000);
                                    }
                                }}
                            >
                                {isAvailable && getProduct(currentSelection?.productId)
                                    ? `Apoiar ${getProduct(currentSelection?.productId).price}`
                                    : currentSelection?.btnText}
                                {isMonthly && selectedValue !== 'custom' ? ' (Mensal)' : ''}
                            </button>
                            {statusMessage && (
                                <p style={{
                                    color: '#b91c1c',
                                    background: '#fef2f2',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    marginTop: '8px',
                                    fontSize: '0.85rem',
                                    textAlign: 'center',
                                    border: '1px solid #fecaca'
                                }}>
                                    {statusMessage}
                                </p>
                            )}
                        </>
                    )}

                    {/* PIX Specific Content */}
                    {activeTab === 'pix' && (
                        <div className="pix-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', gap: '15px' }}>
                            <p style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
                                O QR Code abaixo é atualizado automaticamente com o valor selecionado ({currentSelection?.value ? `R$ ${currentSelection.value}` : 'Livre'}).
                            </p>

                            <div className="pix-copy-area" style={{ width: '100%', maxWidth: '300px' }}>
                                <p className="pix-label" style={{ textAlign: 'center', marginBottom: '8px' }}>{t.donationPixLabel}</p>
                                <div className="pix-key-container" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'rgba(0,0,0,0.05)',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(0,0,0,0.1)'
                                }}>
                                    <span className="pix-key" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
                                        appcomunicamais@gmail.com
                                    </span>
                                    <button
                                        onClick={handleCopy}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: copied ? '#22c55e' : '#666'
                                        }}
                                        title={copied ? "Copied!" : "Copy to clipboard"}
                                    >
                                        {copied ? <Check size={20} /> : <Copy size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="qr-code-container" style={{
                                padding: '16px',
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <QRCodeCanvas
                                    value={
                                        (() => {
                                            const staticPayload = "00020126470014BR.GOV.BCB.PIX0125appcomunicamais@gmail.com5204000053039865802BR5923Thiago Freitas Barcelos6009SAO PAULO62140510bS8nZbKPPI63049D9F";
                                            try {
                                                const currentVal = SUGGESTED_VALUES.find(v => v.id === selectedValue)?.value || 0;

                                                // Handle various CJS import interop scenarios
                                                const payloadFn = pixPayload.payload || (pixPayload.default && pixPayload.default.payload) || pixPayload;

                                                if (typeof payloadFn !== 'function') {
                                                    console.warn('PixPayload invalid:', pixPayload);
                                                    return staticPayload;
                                                }

                                                return payloadFn({
                                                    key: 'appcomunicamais@gmail.com',
                                                    name: 'Thiago Freitas Barcelos',
                                                    city: 'SAO PAULO',
                                                    amount: currentVal > 0 ? currentVal : undefined,
                                                    txid: '***' // Using standard wildcard for dynamic payments
                                                });
                                            } catch (e) {
                                                console.error('PIX Gen Error:', e);
                                                return staticPayload;
                                            }
                                        })()
                                    }
                                    size={150}
                                />
                            </div>
                        </div>
                    )}

                    <div className="donation-footer">
                        <p className="heart-text"><strong>{t.donationThanks}</strong> <Heart size={16} fill="#ef4444" color="#ef4444" style={{ display: 'inline', verticalAlign: 'middle' }} /></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationModal;
