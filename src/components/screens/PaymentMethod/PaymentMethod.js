// src/components/screens/PaymentMethod/PaymentMethod.js
import React, { useState } from 'react';
import './PaymentMethod.css'; // Импорт стилей
import ThankYou from '../ThankYou/ThankYou'; // Импортируем экран благодарности
import arrowLeft from '../../../assets/icon/arrow-left.svg'; // Импорт иконки

const PaymentMethod = ({ onBack, selectedAmount, selectedPrice }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isThankYouVisible, setThankYouVisible] = useState(false);

  const handlePayment = () => {
    if (selectedMethod) {
      setThankYouVisible(true);
    }
  };

  if (isThankYouVisible) {
    return (
      <ThankYou 
        amount={selectedAmount} 
        balance={156} 
        onContinue={() => console.log('Продолжить')} 
      />
    );
  }

  return (
    <div className="payment-method">
      {/* Кнопка назад */}
      <img
        src={arrowLeft}
        alt="Назад"
        className="back-button"
        onClick={onBack}
      />

      <h2>Выбери способ оплаты</h2>
      <h3>Твой заказ: {selectedAmount} аморитов — {selectedPrice}$</h3>
      <p>Ты можешь оплатить кредитной картой или&#160;криптовалютой:</p>

      <div className="method-options">
        <div
          className={`method-option ${selectedMethod === 'card' ? 'active' : ''}`}
          onClick={() => setSelectedMethod('card')}
        >
          Visa/Mastercard
        </div>
        <div
          className={`method-option ${selectedMethod === 'crypto' ? 'active' : ''}`}
          onClick={() => setSelectedMethod('crypto')}
        >
          Криптовалюта (USDT)
        </div>
      </div>

      {selectedMethod && (
        <button className="purchase-button" onClick={handlePayment}>
          Оплатить
        </button>
      )}
    </div>
  );
};

export default PaymentMethod;