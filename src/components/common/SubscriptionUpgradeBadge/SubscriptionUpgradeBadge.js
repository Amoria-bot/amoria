import SubscriptionBadgeIcon from '../../../assets/icon/premium-badge.svg';
import './SubscriptionUpgradeBadge.css'; // Импортируем стили

const SubscriptionUpgradeBadge = () => {
  return (
    <div className="subscription-upgrade-badge">
      <div className="subscription-badge-icon">
        <img src={SubscriptionBadgeIcon} alt="Subscription Badge" />
      </div>
      <div className="subscription-badge-content">
        <div className="subscription-badge-title">ПЕРЕХОДИ НА PREMIUM</div>
        <div className="subscription-badge-subtitle">Разблокируй все персонажи!</div>
      </div>
    </div>
  );
};

export default SubscriptionUpgradeBadge;
