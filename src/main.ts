import 'dotenv/config';

import { App, GenericMessageEvent } from '@slack/bolt';
import { OpenAI } from './OpenAI';


async function main() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const app = new App({
    appToken: process.env.SLACK_APP_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    token: process.env.SLACK_USER_TOKEN,
  });

  app.event('message', async ({ message, say }) => {
    if ((message as GenericMessageEvent).bot_id === process.env.SLACK_BOT_ID) return;

    if (!message.subtype) {
      try {
        const response = await openai.chatComplete(
          `${ process.env.MAIN_SYSTEM_PROMPT }.${ process.env.DM_SYSTEM_PROMPT }`,
          (message as GenericMessageEvent).text || 'Hello?'
        );

        await say({
          text: `${ response } [Writen by 'Alex-ooo-gpt' not Alex]`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'plain_text',
                text: response
              }
            },
            {
              type: 'context',
              elements: [
                {
                  text: 'Writen by `Alex-ooo-gpt` not Alex',
                  type: 'mrkdwn'
                }
              ]
            }
          ]
        });
      } catch (e) {
        console.error('Message Error', e);
      }
    }
  });

  // app.event('app_mention', async ({ event, say }) => {
  //   console.log('App Mention', event);
  //
  //   try {
  //     const response = await openai.chatComplete(
  //       `${process.env.MAIN_SYSTEM_PROMPT}.${process.env.MENTION_SYSTEM_PROMPT}`,
  //       event.text || 'Hello?'
  //     );
  //
  //     await say(`<@${ event.user }> ${response}`);
  //   } catch (e) {
  //     console.error('Message Error', e);
  //   }
  // });

  await app.start();
}

main().catch(console.error);
