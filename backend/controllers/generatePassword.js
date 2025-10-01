import crypto from 'crypto';

function generateStrongPassword(length = 16, noSymbols = false) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  let allChars = upper + lower + digits + (noSymbols ? '' : symbols);

  let passwordChars = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
  ];
  if (!noSymbols) {
    passwordChars.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }

  while (passwordChars.length < length) {
    passwordChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(crypto.randomInt(i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join('');
}
const generate = (req, res) => {
    try {
    const { length = 16, noSymbols = false } = req.body;

    const safeLength = Math.min(Math.max(Number(length) || 16, 16), 24);

    const password = generateStrongPassword(safeLength, Boolean(noSymbols));
    res.json({ password });
  } catch (error) {
    console.error('Error in generate-password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default { generate };