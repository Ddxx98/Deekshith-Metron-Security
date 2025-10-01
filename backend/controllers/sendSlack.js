import { WebClient } from '@slack/web-api';
import dotenv from "dotenv";

dotenv.config();

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

const send = async (req, res) => {
    try {
    const { channel, password } = req.body;
    if (!channel || !password) {
      return res.status(400).json({ error: 'Channel and password required' });
    }

    await slackClient.chat.postMessage({
      channel,
      text: `🔐 Your generated password is (secret): \`${password}\``,
    });

    res.json({ success: true, message: 'Password sent to Slack' });
  } catch (error) {
    console.error('Slack send error:', error);
    res.status(500).json({ error: 'Failed to send message to Slack' });
  }
}

export default { send };