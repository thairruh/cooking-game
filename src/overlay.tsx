import React, { useEffect, useState } from 'react';
import { EventBus } from './game/EventBus'; // same EventBus Phaser uses
import Message from './game/message';

const GameOverlay: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleShowMessage = (msg: string) => setMessage(msg);
    EventBus.on('show-message', handleShowMessage);
    return () => {
      EventBus.off('show-message', handleShowMessage);
    };
  }, []);

  return (
    <>
      {message && (
        <div
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.8)',
            border: '2px solid white',
            padding: '14px 20px',
            borderRadius: '10px',
            color: 'white',
            fontFamily: 'monospace',
            zIndex: 9999,
          }}
        >
          <Message message={message} />
        </div>
      )}
    </>
  );
};

export default GameOverlay;
