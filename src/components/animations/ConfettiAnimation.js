import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animationData from '../../assets/animations/confetti.json';

const ConfettiAnimation = React.memo(() => {
  const container = useRef(null);
  const animationInstance = useRef(null);

  useEffect(() => {
    console.log('ConfettiAnimation: Загружается анимация');

    if (!animationInstance.current) {
      animationInstance.current = lottie.loadAnimation({
        container: container.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: animationData,
      });

      animationInstance.current.addEventListener('complete', () => {
        console.log('ConfettiAnimation: Анимация завершена');
      });
    }

    return () => {
      if (animationInstance.current) {
        console.log('ConfettiAnimation: Компонент размонтирован');
        animationInstance.current.destroy();
        animationInstance.current = null;
      }
    };
  }, []);

  return <div ref={container} className="confetti-container" />;
});

export default ConfettiAnimation;
