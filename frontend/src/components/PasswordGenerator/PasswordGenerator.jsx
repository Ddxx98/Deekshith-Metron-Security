import React, { useState } from 'react';
import axios from 'axios';
import styles from './PasswordGenerator.module.css';

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [excludeSymbols, setExcludeSymbols] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [slackChannel, setSlackChannel] = useState('');
  const [sendingSlack, setSendingSlack] = useState(false);
  const [slackMessage, setSlackMessage] = useState('');

  const generatePassword = async () => {
    try {
      const { data } = await axios.post('http://localhost:3000/api/generate-password', {
        length,
        noSymbols: excludeSymbols,
      });
      if (data.password) {
        setGeneratedPassword(data.password);
        setCopySuccess('');
        setSlackMessage('');
      }
    } catch {
      setGeneratedPassword('');
      setCopySuccess('Error generating password');
      setSlackMessage('');
    }
  };

  const copyToClipboard = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const sendToSlack = async () => {
    if (!generatedPassword || !slackChannel.trim()) {
      setSlackMessage('Please generate a password and enter Slack channel.');
      return;
    }
    setSendingSlack(true);
    setSlackMessage('');
    try {
      const { data } = await axios.post('http://localhost:3000/api/send-slack', {
        channel: slackChannel.trim(),
        password: generatedPassword,
      });
      if (data.success) {
        setSlackMessage('Password sent to Slack successfully!');
      } else {
        setSlackMessage('Failed to send password: ' + (data.error || 'unknown error'));
      }
    } catch {
      setSlackMessage('Error sending password to Slack');
    } finally {
      setSendingSlack(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Password Generator</h2>

      <div className={styles.options}>
        <label className={styles.label}>
          Length: {length}
          <input
            type="range"
            min="16"
            max="24"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className={styles.slider}
            aria-label="Password length"
          />
        </label>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={excludeSymbols}
            onChange={(e) => setExcludeSymbols(e.target.checked)}
          />
          Exclude symbols
        </label>
      </div>

      <button className={styles.generateButton} onClick={generatePassword}>
        Generate Password
      </button>

      {generatedPassword && (
        <>
          <div className={styles.output}>
            <input
              type="text"
              value={generatedPassword}
              readOnly
              className={styles.generatedInput}
              aria-label="Generated password"
            />
            <button
              className={styles.copyButton}
              onClick={copyToClipboard}
              aria-label="Copy generated password"
            >
              Copy
            </button>
          </div>

          <div className={styles.slackSection}>
            <input
              type="text"
              placeholder="Enter Slack channel or user ID"
              value={slackChannel}
              onChange={(e) => setSlackChannel(e.target.value)}
              className={styles.slackInput}
              aria-label="Slack channel or user ID"
            />
            <button
              className={styles.sendSlackButton}
              onClick={sendToSlack}
              disabled={sendingSlack}
            >
              {sendingSlack ? 'Sending...' : 'Send to Slack'}
            </button>
          </div>
          {slackMessage && <p className={styles.slackMessage}>{slackMessage}</p>}
        </>
      )}

      {copySuccess && <p className={styles.copySuccess}>{copySuccess}</p>}
    </div>
  );
};

export default PasswordGenerator;
