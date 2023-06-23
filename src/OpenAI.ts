import { Configuration, OpenAIApi } from 'openai';

export type OpenAIOptions = {
  apiKey: string;
  model?: string;
}

export class OpenAI {
  private openai: OpenAIApi;
  private model: string;

  constructor({
    apiKey,
    model = 'gpt-3.5-turbo'
  }: OpenAIOptions) {
    this.openai = new OpenAIApi(new Configuration({
      apiKey
    }));

    this.model = model;
  }

  public async chatComplete(systemPrompt: string, userPrompt: string) {
    const response =  await this.openai.createChatCompletion({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
    });

    if (!response.data.choices?.length || !response.data.choices[0].message?.content) {
      throw new Error('No response from OpenAI');
    }

    return response.data.choices[0].message?.content;
  }
}
