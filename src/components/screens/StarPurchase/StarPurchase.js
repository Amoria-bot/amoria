import React, { useState, useEffect } from 'react';
import './StarPurchase.css'; // Импорт стилей
import PaymentMethod from '../PaymentMethod/PaymentMethod'; // Экран оплаты
import PremiumBadge from '../../../assets/icon/premium-badge.svg'; // Импорт премиум-бейджа
import PremiumIcon1 from '../../../assets/icon/premium-b1.svg';
import PremiumIcon2 from '../../../assets/icon/premium-b2.svg';
import PremiumIcon3 from '../../../assets/icon/premium-b3.svg';
import PremiumIcon4 from '../../../assets/icon/premium-b4.svg';

const StarPurchase = () => {
  const [amoritBalance, setAmoritBalance] = useState(0); // Начальное значение баланса
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isPaymentMethodVisible, setPaymentMethodVisible] = useState(false);
  const [isPurchaseInProgress, setIsPurchaseInProgress] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState('monthly'); // Статус подписки

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
      console.log(`Покупка ${selectedAmount} $AMOCOIN начата`);
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

  const handleSubscriptionSelect = (type) => {
    setSelectedSubscription(type);
  };

  const subscriptionPrice = selectedSubscription === 'monthly' ? '$2,82 / месяц' : '$24 / год';

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
      <h2>$AMOCOIN</h2>
      <p>
        $AMOCOIN — внутренняя валюта Amoria, которую вы зарабатываете, играя и выполняя задания.
        Тратьте $AMOCOIN на общение с персонажами, открытие эксклюзивных фото и видео, а также доступ
        к премиум-контенту.
      </p>

      <h1>
        {amoritBalance} <span className="amorit-icon"></span>
      </h1>
      <p>твой текущий баланс</p>

      <h2>Пополнение баланса $AMOCOIN</h2>
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
              {option.amount} $AMOCOIN — {option.price}$
            </span>
          </div>
        ))}
      </div>

      {selectedAmount && (
        <div className="purchase-section">
          <h3>Выбранное количество: {selectedAmount} $AMOCOIN</h3>
          <button className="purchase-button" onClick={handlePurchase}>
            Купить $AMOCOIN
          </button>
        </div>
      )}

      <button className="reset-button" onClick={handleResetBalance}>
        Сбросить баланс
      </button>

      {/* Новый блок подписки */}
      <div className="subscription-container">
        <h2>Подписка на премиум</h2>

        <div className="subscription-options">
          <div
            className={`subscription-option monthly ${selectedSubscription === 'monthly' ? 'active' : ''}`}
            onClick={() => handleSubscriptionSelect('monthly')}
          >
            <div className={`radio-button ${selectedSubscription === 'monthly' ? 'active' : 'inactive'}`}></div>
            <div className="subscription-details">
              <div className="duration">1 Месяц</div>
              <div className="price">$2,82</div>
            </div>
          </div>

          <div
            className={`subscription-option yearly ${selectedSubscription === 'yearly' ? 'active' : ''}`}
            onClick={() => handleSubscriptionSelect('yearly')}
          >
            <div className={`radio-button ${selectedSubscription === 'yearly' ? 'active' : 'inactive'}`}></div>
            <div className="subscription-details">
              <div className="duration2">1 Год</div>
              <div className="price">$24</div>
              <div className="monthly-rate">$2 / месяц</div>
            </div>
          </div>
        </div>

        {/* Кнопка подписки */}
        <button className="purchase-button">
          Подписаться ({subscriptionPrice})
        </button>

        <div className="subscription-benefits">
          <img src={PremiumBadge} alt="Premium" className="premium-badge-s" />
          <h3>Преимущества</h3>
          <div className="benefit">
            <img src={PremiumIcon1} alt="Chat Unlock" className="benefit-icon ChatUnlock" />
            <div className="benefit-text">
              <strong>Доступ ко всем чатам</strong>
              <p>Получите неограниченный доступ к эксклюзивным функциям чатов и взаимодействуйте с премиум-персонажами.</p>
            </div>
          </div>
          <div className="benefit">
            <img src={PremiumIcon2} alt="Premium Gallery" className="benefit-icon PremiumGallery" />
            <div className="benefit-text">
              <strong>Специальные галереи</strong>
              <p>Откройте доступ к премиальным фото- и видео-галереям с эксклюзивным контентом.</p>
            </div>
          </div>
          <div className="benefit">
            <img src={PremiumIcon3} alt="Reward Boost" className="benefit-icon RewardBoost" />
            <div className="benefit-text">
              <strong>Увеличенные награды за задания</strong>
              <p>Получайте больше $AMOCOIN за выполнение ежедневных и специальных заданий. Важно для будущего Airdrop.</p>
            </div>
          </div>
          <div className="benefit">
            <img src={PremiumIcon4} alt="Priority Support" className="benefit-icon PrioritySupport" />
            <div className="benefit-text">
              <strong>Приоритетная поддержка</strong>
              <p>Наслаждайтесь быстрым ответом поддержки и приоритетной помощью, когда это необходимо.</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default StarPurchase;
