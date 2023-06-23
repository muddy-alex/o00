import { App, AppMentionEvent } from '@slack/bolt';
import { GenericMessageEvent } from '@slack/bolt/dist/types/events/message-events';
import { Configuration, OpenAIApi } from 'openai';
import { formatDistance } from 'date-fns';

const imPrompt = process.env.OPENAI_IM_PROMPT;
const returnDate = new Date(process.env.RETURN_DATE);

const createGenericReply = (message: GenericMessageEvent | AppMentionEvent) => {
  return `Sorry <@${ message.user }>, I'm on my holidays at the moment, back in ${formatDistance(new Date(), returnDate)})}`
}

async function main() {
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }));

  const app = new App({
    appToken: process.env.SLACK_APP_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    ignoreSelf: false,
    token: process.env.SLACK_USER_TOKEN,
  })

  app.event('message', async ({ message, say }) => {
    if (!message.subtype) {
      const aiResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `${imPrompt} "${message.text}"`
        }],
      });

      if (aiResponse.data.choices[0].message?.content) {
        await say(aiResponse.data.choices[0].message?.content);
      } else {
        await say(createGenericReply(message));
      }
    }
  });

  app.event('app_mention', async ({ event, say }) => {
    const aiResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `${imPrompt} "${event.text}"`
      }],
    });

    if (aiResponse.data.choices[0].message?.content) {
      await say(aiResponse.data.choices[0].message?.content);
    } else {
      await say(createGenericReply(event));
    }
  });

  await app.start();
}

main().catch(console.error);
