import crypto from 'crypto';
import fetch from 'node-fetch';

const commonPasswords = new Set([
  '123456','password','123456789','12345','12345678','qwerty','abc123',
]);

function validatePasswordPolicy(password) {
  const errors = [];
  if (password.length < 12) errors.push('Too short (minimum 12 characters)');
  if (!/[A-Z]/.test(password)) errors.push('Missing uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Missing lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Missing number');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('Missing special character');
  if (commonPasswords.has(password.toLowerCase())) errors.push('Found in common password list');
  return errors;
}

const check = async (req, res) => {
  try {
    const { password } = req.body;
    if (typeof password !== 'string') return res.status(400).json({ error: 'Password required' });

    // Validate policy rules first
    const validationErrors = validatePasswordPolicy(password);
    if (validationErrors.length > 0) {
      return res.json({
        valid: false,
        reasons: validationErrors,
        breachCount: null,
      });
    }

    const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!response.ok) {
      return res.status(503).json({ error: 'Failed to query breach database' });
    }
    const body = await response.text();

    const lines = body.split('\r\n');
    let foundCount = 0;
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix === suffix) {
        foundCount = parseInt(count, 10);
        break;
      }
    }

    res.json({
      valid: true,
      reasons: [],
      breachCount: foundCount,
    });
  } catch (error) {
    console.error('Error in check-password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default { check };