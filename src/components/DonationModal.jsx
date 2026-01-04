import React, { useMemo } from 'react';
import { X, Heart } from 'lucide-react';
import { translations } from '../utils/translations';

const DonationModal = ({ isOpen, onClose, language = 'pt' }) => {
    const [selectedValue, setSelectedValue] = React.useState('medium');
    const [isMonthly, setIsMonthly] = React.useState(true);

    const t = translations[language] || translations['pt'];

    const SUGGESTED_VALUES = useMemo(() => [
        {
            id: 'small',
            value: 5,
            label: t.donationValueLabelSmall,
            btnText: t.donationValueBtnSmall,
            impact: t.donationValueImpactSmall
        },
        {
            id: 'medium',
            value: 10,
            label: t.donationValueLabelMedium,
            btnText: t.donationValueBtnMedium,
            impact: t.donationValueImpactMedium
        },
        {
            id: 'large',
            value: 20,
            label: t.donationValueLabelLarge,
            btnText: t.donationValueBtnLarge,
            impact: t.donationValueImpactLarge
        },
        {
            id: 'custom',
            value: 0,
            label: t.donationValueLabelCustom,
            btnText: t.donationValueBtnCustom,
            impact: t.donationValueImpactCustom
        }
    ], [t]);

    if (!isOpen) return null;

    const currentSelection = SUGGESTED_VALUES.find(v => v.id === selectedValue);

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-modal donation-modal-container" onClick={e => e.stopPropagation()}>
                <div className="settings-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Heart fill="#ef4444" color="#ef4444" size={24} />
                        <h2>{t.donationTitle}</h2>
                    </div>
                    <button onClick={onClose} className="close-btn" aria-label={t.close}>
                        <X size={24} />
                    </button>
                </div>

                <div className="settings-body donation-body">
                    <p className="donation-intro">
                        {t.donationIntro}
                    </p>

                    <h3 className="donation-subtitle" style={{ marginTop: 0 }}>{t.donationHelpTitle}</h3>
                    <ul className="donation-list">
                        <li><strong>{t.donationHelpItem1.split(':')[0]}:</strong> {t.donationHelpItem1.split(':')[1]}</li>
                        <li><strong>{t.donationHelpItem2.split(':')[0]}:</strong> {t.donationHelpItem2.split(':')[1]}</li>
                        <li><strong>{t.donationHelpItem3.split(':')[0]}:</strong> {t.donationHelpItem3.split(':')[1]}</li>
                        <li><strong>{t.donationHelpItem4}</strong></li>
                        <li><strong>{t.donationHelpItem5.split(':')[0]}:</strong> {t.donationHelpItem5.split(':')[1]}</li>
                    </ul>

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

                    <div className="impact-box">
                        <div className="impact-header">
                            <strong>{t.donationHelpTitle}</strong>
                        </div>
                        <p>{currentSelection?.impact}</p>
                    </div>

                    <button className="primary-donate-btn">
                        {currentSelection?.btnText}
                        {isMonthly && selectedValue !== 'custom' ? ' (Mensal)' : ''}
                    </button>

                    <h3 className="donation-subtitle">{t.donationPaymentMethods}</h3>
                    <div className="payment-options-row">
                        <div className="payment-pill">PIX</div>
                        <div className="payment-pill">PicPay</div>
                        <div className="payment-pill">MercadoPago</div>
                        <div className="payment-pill">PayPal</div>
                    </div>

                    <div className="pix-copy-area">
                        <p className="pix-label">{t.donationPixLabel}</p>
                        <div className="pix-key">appcomunicamais@gmail.com</div>
                    </div>

                    <div className="donation-footer">
                        <p className="heart-text"><strong>{t.donationThanks}</strong> <Heart size={16} fill="#ef4444" color="#ef4444" style={{ display: 'inline', verticalAlign: 'middle' }} /></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationModal;
