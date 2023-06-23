declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPEN_AI_KEY: string;
      SLACK_SIGNING_SECRET: string;
      SLACK_APP_TOKEN: string;
      SLACK_USER_TOKEN: string;
      IM_PROMPT: string;
      RETURN_DATE: string;
    }
  }
}

export {}
