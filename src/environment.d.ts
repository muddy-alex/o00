declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY: string;
      SLACK_SIGNING_SECRET: string;
      SLACK_APP_TOKEN: string;
      SLACK_USER_TOKEN: string;
      SLACK_BOT_ID: string;
      MAIN_SYSTEM_PROMPT: string;
      DM_SYSTEM_PROMPT: string;
      MENTION_SYSTEM_PROMPT: string;
      RETURN_DATE: string;
    }
  }
}

export {}
