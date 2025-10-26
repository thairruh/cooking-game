import React, { useState } from 'react';
import { generateDialogue } from './api/dialogue';

const DialogueBox: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');   // what the player types
  const [response, setResponse] = useState<string>('');     // what the AI replies
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    try {
      setLoading(true);
      const data = await generateDialogue(userInput);       // send the user’s input
      setResponse(data.message);                            // show Flask AI’s reply
    } catch (err) {
      console.error(err);
      setResponse('Error connecting to AI');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(); // send on Enter
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '5%',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.75)',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        width: '60%',
        maxWidth: '500px',
        textAlign: 'center',
      }}
    >
      <input
        type="text"
        placeholder="Type your message..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          marginBottom: '10px',
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: '#e2b27e',
          color: '#000',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 14px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Thinking...' : 'Send'}
      </button>

      <p style={{ marginTop: '12px', fontSize: '14px' }}>
        {response && `AI: ${response}`}
      </p>
    </div>
  );
};

export default DialogueBox;
