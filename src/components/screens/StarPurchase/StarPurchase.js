import React, { useState, useEffect } from 'react';
import './StarPurchase.css'; // Импорт стилей
import PaymentMethod from '../PaymentMethod/PaymentMethod'; // Экран оплаты

const StarPurchase = () => {
  const [amoritBalance, setAmoritBalance] = useState(0); // Начальное значение баланса
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isPaymentMethodVisible, setPaymentMethodVisible] = useState(false);
  const [isPurchaseInProgress, setIsPurchaseInProgress] = useState(false);

  // 1. Загружаем баланс из LocalStorage при первом рендере
  useEffect(() => {
    const savedBalance = parseInt(localStorage.getItem('amoritBalance'), 10);
    if (isNaN(savedBalance)) {
      console.warn('Баланс в LocalStorage повреждён или не найден. Устанавливаем 0.');
      localStorage.setItem('amoritBalance', 0);
      setAmoritBalance(0);
    } else {
      console.log(`Загруженный баланс: ${savedBalance}`);
      setAmoritBalance(savedBalance);
    }
  }, []);

  // 2. Обновляем баланс и сохраняем в LocalStorage
  const updateAmoritBalance = (amount) => {
    const newBalance = amoritBalance + amount;
    console.log(`Пополнение: ${amount}, Новый баланс: ${newBalance}`);
    setAmoritBalance(newBalance);
    localStorage.setItem('amoritBalance', newBalance);
  };

  // 3. Обрабатываем покупку
  const handlePurchase = () => {
    if (selectedAmount && !isPurchaseInProgress) {
      console.log(`Покупка ${selectedAmount} аморитов начата`);
      setIsPurchaseInProgress(true); // Блокируем повторную покупку
      updateAmoritBalance(selectedAmount); // Обновляем баланс
      setPaymentMethodVisible(true); // Переход на экран оплаты
    }
  };

  const handleBack = () => {
    setPaymentMethodVisible(false);
    setSelectedAmount(null);
    setIsPurchaseInProgress(false); // Сброс флага
  };

  const handleResetBalance = () => {
    console.log('Сброс баланса');
    setAmoritBalance(0);
    localStorage.setItem('amoritBalance', 0); // Полностью сбрасываем баланс
  };

  const starOptions = [
    { amount: 100, price: 0.99 },
    { amount: 500, price: 4.49 },
    { amount: 1000, price: 8.99 },
    { amount: 2000, price: 16.99 },
    { amount: 5000, price: 39.99 },
  ];

  if (isPaymentMethodVisible) {
    return (
      <PaymentMethod
        onBack={handleBack}
        selectedAmount={selectedAmount}
        selectedPrice={starOptions.find((option) => option.amount === selectedAmount)?.price}
      />
    );
  }

  console.log(`Баланс перед рендером: ${amoritBalance}`);

  return (
    <div className="star-purchase">
      <h2>Амориты</h2>
      <p>
        Амориты — внутренняя валюта Amoria, которую вы зарабатываете, играя и выполняя задания.
        Тратьте амориты на общение с персонажами, открытие эксклюзивных фото и видео, а также доступ
        к премиум-контенту.
      </p>

      <h1>
        {amoritBalance} <span className="amorit-icon">🪙</span>
      </h1>
      <p>твой текущий баланс</p>

      <h2>Пополнение баланса аморитов</h2>
      <div className="amount-options">
        {starOptions.map((option, index) => (
          <div
            key={index}
            className={`amount-option ${
              selectedAmount === option.amount ? 'active' : ''
            }`}
            onClick={() => setSelectedAmount(option.amount)}
          >
            <span>
              {option.amount} аморитов — {option.price}$
            </span>
          </div>
        ))}
      </div>

      {selectedAmount && (
        <div className="purchase-section">
          <h3>Выбранное количество: {selectedAmount} аморитов</h3>
          <button className="purchase-button" onClick={handlePurchase}>
            Купить амориты
          </button>
        </div>
      )}

      <button className="reset-button" onClick={handleResetBalance}>
        Сбросить баланс
      </button>
    </div>
  );
};

export default StarPurchase;
