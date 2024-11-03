import React, { useState, useEffect } from 'react';
import './StarPurchase.css';
import PaymentMethod from '../PaymentMethod/PaymentMethod';
import PremiumBadge from '../../../assets/icon/premium-badge.svg';
import PremiumIcon1 from '../../../assets/icon/premium-b1.svg';
import PremiumIcon2 from '../../../assets/icon/premium-b2.svg';
import PremiumIcon3 from '../../../assets/icon/premium-b3.svg';
import PremiumIcon4 from '../../../assets/icon/premium-b4.svg';

const StarPurchase = () => {
  const [amoritBalance, setAmoritBalance] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isPaymentMethodVisible, setPaymentMethodVisible] = useState(false);
  const [isPurchaseInProgress, setIsPurchaseInProgress] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState('monthly');
  const [isSubscriptionFlow, setSubscriptionFlow] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  useEffect(() => {
    console.log('Начало загрузки данных из localStorage в StarPurchase');
    
    const savedBalance = parseInt(localStorage.getItem('amoritBalance'), 10);
    const savedSubscription = localStorage.getItem('activeSubscription');
  
    if (isNaN(savedBalance)) {
      console.warn('Баланс в LocalStorage повреждён или не найден. Устанавливаем 0.');
      localStorage.setItem('amoritBalance', 0);
      setAmoritBalance(0);
    } else {
      console.log(`Загруженный баланс: ${savedBalance}`);
      setAmoritBalance(savedBalance);
    }
  
    if (savedSubscription) {
      try {
        const parsedSubscription = JSON.parse(savedSubscription);
        if (parsedSubscription && parsedSubscription.endDate) {
          const subscriptionEndDate = new Date(parsedSubscription.endDate);
          const currentDate = new Date();
          if (subscriptionEndDate > currentDate) {
            console.log(`Подписка успешно загружена из localStorage:`, parsedSubscription);
            setCurrentSubscription(parsedSubscription);
          } else {
            console.warn('Подписка истекла. Удаляем просроченную подписку из localStorage.');
            localStorage.removeItem('activeSubscription');
            setCurrentSubscription(null);
          }
        } else {
          console.warn('Неполные данные о подписке в localStorage, устанавливаем значение null.');
          setCurrentSubscription(null);
        }
      } catch (error) {
        console.error('Ошибка при разборе подписки из localStorage:', error);
        setCurrentSubscription(null);
      }
    } else {
      console.log('Подписка в LocalStorage не найдена.');
    }
  }, []);
  
  const updateAmoritBalance = (amount) => {
    const newBalance = amoritBalance + amount;
    console.log(`Пополнение: ${amount}, Новый баланс: ${newBalance}`);
    setAmoritBalance(newBalance);
    localStorage.setItem('amoritBalance', newBalance);
  };

  const handlePurchase = () => {
    if (selectedAmount && !isPurchaseInProgress) {
      console.log(`Покупка ${selectedAmount} $AMOCOIN начата`);
      setIsPurchaseInProgress(true);
      updateAmoritBalance(selectedAmount);
      setPaymentMethodVisible(true);
    }
  };

  const handleSubscriptionPurchase = () => {
    console.log('Начало покупки подписки');
    setSubscriptionFlow(true);
    setPaymentMethodVisible(true);
  };

  const finalizeSubscriptionPurchase = () => {
    // Сохранение данных о подписке в localStorage
    const endDate = selectedSubscription === 'monthly' ? 
      new Date(new Date().setMonth(new Date().getMonth() + 1)) : 
      new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    const subscriptionData = {
      type: selectedSubscription,
      endDate: endDate.toISOString()
    };
    console.log('Сохранение подписки в localStorage:', subscriptionData);
    localStorage.setItem('activeSubscription', JSON.stringify(subscriptionData));
    setCurrentSubscription(subscriptionData);
    console.log('Текущая подписка после сохранения:', subscriptionData);
    setPaymentMethodVisible(false);
    setSubscriptionFlow(false);
  };

  const handleBack = () => {
    setPaymentMethodVisible(false);
    setSelectedAmount(null);
    setIsPurchaseInProgress(false);
    setSubscriptionFlow(false);
  };

  const handleResetBalance = () => {
    console.log('Сброс баланса');
    setAmoritBalance(0);
    localStorage.setItem('amoritBalance', 0);
  };

  const handleResetSubscription = () => {
    console.log('Сброс подписки');
    setCurrentSubscription(null);
    localStorage.removeItem('activeSubscription');
  };

  const starOptions = [
    { amount: 100, price: 0.99 },
    { amount: 500, price: 4.49 },
    { amount: 1000, price: 8.99 },
    { amount: 2000, price: 16.99 },
    { amount: 5000, price: 39.99 },
  ];

  const handleSubscriptionSelect = (type) => {
    console.log(`Выбор подписки: ${type}`);
    setSelectedSubscription(type);
  };

  const subscriptionPrice = selectedSubscription === 'monthly' ? '$2,82 / месяц' : '$24 / год';

  if (isPaymentMethodVisible) {
    return (
      <PaymentMethod
        onBack={handleBack}
        selectedAmount={isSubscriptionFlow ? null : selectedAmount}
        selectedPrice={isSubscriptionFlow ? subscriptionPrice : starOptions.find((option) => option.amount === selectedAmount)?.price}
        isSubscription={isSubscriptionFlow}
        subscriptionPrice={subscriptionPrice}
        subscriptionDuration={selectedSubscription === 'monthly' ? '1 месяц' : '1 год'}
        onSuccess={finalizeSubscriptionPurchase}
      />
    );
  }

  console.log(`Баланс перед рендером: ${amoritBalance}`);
  console.log(`Текущая подписка перед рендером:`, currentSubscription);

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
      <p>твой текущий баланс $AMOCOIN</p>

      <h2>Пополнение баланса</h2>
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

      <button className="reset-button" onClick={handleResetSubscription}>
        Сбросить подписку
      </button>

      <div className="subscription-container">
        <h2>Подписка на премиум</h2>

        {currentSubscription && (
        <div className="current-subscription">
          <h2>Текущая подписка:</h2>
          <p>
            Подписка на {currentSubscription.type === 'monthly' ? 'месяц' : 'год'} до {new Date(currentSubscription.endDate).toLocaleDateString()}
          </p>
        </div>
      )}

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
              <div className="duration">1 Год</div>
              <div className="price">$24</div>
              <div className="monthly-rate">$2 / месяц</div>
            </div>
          </div>
        </div>

        <button className="purchase-button" onClick={handleSubscriptionPurchase}>
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
              <p>Получайте больше $AMOCOIN за выполнение ежедневных и специальных заданий.</p>
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
