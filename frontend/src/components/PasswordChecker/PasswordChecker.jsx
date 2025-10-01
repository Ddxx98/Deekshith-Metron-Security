import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './PasswordChecker.module.css';

const PasswordChecker = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [breachCount, setBreachCount] = useState(null);
  const [checkingBreach, setCheckingBreach] = useState(false);

  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 12) errors.push('Too short (minimum 12 characters)');
    if (!/[A-Z]/.test(pwd)) errors.push('Missing uppercase letter');
    if (!/[a-z]/.test(pwd)) errors.push('Missing lowercase letter');
    if (!/[0-9]/.test(pwd)) errors.push('Missing number');
    if (!/[^A-Za-z0-9]/.test(pwd)) errors.push('Missing special character');
    return errors;
  };

  const checkBreach = async (pwd) => {
    setCheckingBreach(true);
    setBreachCount(null);
    try {
      const { data } = await axios.post('http://localhost:3000/api/check-password', { password: pwd });
      if (data.breachCount !== undefined) {
        setBreachCount(data.breachCount);
      } else {
        setBreachCount(0);
      }
    } catch {
      setBreachCount(null);
    } finally {
      setCheckingBreach(false);
    }
  };

  const onPasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setFeedback(validatePassword(val));
    setBreachCount(null);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (password.length >= 12 && feedback.length === 0) {
      checkBreach(password);
    } else {
      setBreachCount(null);
    }
  }, [password, feedback]);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Password Strength Checker</h2>
      <div className={styles.inputWrapper}>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={onPasswordChange}
          className={styles.input}
          placeholder="Enter a password to check"
          autoComplete="new-password"
          aria-label="Password"
        />
        <button
          type="button"
          className={styles.eyeButton}
          onClick={toggleShowPassword}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.eyeIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.054.186-2.068.525-3.002M9.88 9.879a3 3 0 004.242 4.242M3 3l18 18"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.eyeIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>
      <ul className={styles.feedbackList}>
        {feedback.map((err, idx) => (
          <li key={idx} className={styles.feedbackItem}>
            {err}
          </li>
        ))}
      </ul>
      {checkingBreach && <p className={styles.checking}>Checking breach database…</p>}
      {breachCount !== null && (
        <p className={breachCount > 0 ? styles.breached : styles.safe}>
          {breachCount > 0
            ? `Found in ${breachCount} breach${breachCount > 1 ? 'es' : ''}. Please choose another password.`
            : 'No breaches found for this password.'}
        </p>
      )}
    </div>
  );
};

export default PasswordChecker;
