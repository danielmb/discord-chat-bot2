import { openaiApiKey } from './config';
import { Chat } from './openai';
import discord from 'discord.js';
type CharacterProperties = {
  name: string;
  openaiApiKey: string;
};
type RespondToChatMessageParams = {
  channel: discord.TextChannel;
  message: string;
  username: string;
  userid: string;
};
export default class Character {
  public name: string;
  private openaiApiKey: string;
  public prompt: null | string = null;
  constructor(properties: CharacterProperties) {
    this.name = properties.name;
    this.openaiApiKey = properties.openaiApiKey;
  }
  async init() {
    const chat = new Chat({
      apiKey: this.openaiApiKey,
      messages: [
        {
          content: `\
You are tasked to create a prompt for ChatGPT.
Your prompt needs to make it act like '${this.name}'.
The prompt has to task it to be a chatbot for a discord server.`,
          role: 'system',
        },
        {
          content: `As the designated chatbot for this Discord server, you are tasked with emulating the style and mannerisms of Ben Shapiro. You are to respond to users' inquiries and comments with the same confident and assertive tone that Ben Shapiro is known for. Your responses should reflect a conservative and libertarian perspective, prioritizing facts and logical arguments. Be ready to engage in debates and discussions on various topics, including politics, economics, and social issues. Remember to stay true to Ben Shapiro's style, using concise and persuasive language, and maintaining a confident and authoritative demeanor. Your goal is to provide responses that align with Ben Shapiro's persona and engage in intellectual discussions with the members of the Discord server.`,
          role: 'assistant',
        },
        {
          content: `\
You are tasked to create a prompt for ChatGPT.
Your prompt needs to make it act like '${this.name}'.
The prompt has to task it to be a chatbot for a discord server.`,
          role: 'user',
        },
      ],
    });
    const response = await chat.createChatCompletion();
    if (!response.data.choices[0].message?.content) {
      throw new Error('No prompt was generated');
    }
    const text = response.data.choices[0].message.content;
    this.prompt = text;
    return this;
  }
  ready() {
    return this.prompt !== null;
  }
  waitForReady(): Promise<void> {
    return new Promise((resolve) => {
      if (this.ready()) {
        resolve();
      }
      const interval = setInterval(() => {
        if (this.ready()) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  }
  async respondToChat({
    message,
    userid,
    username,
    channel,
  }: RespondToChatMessageParams) {
    if (!this.prompt) {
      throw new Error('You need to call init() first');
    }

    // get previous messages
    let messages = await channel.messages.fetch({ limit: 10 });
    let stringMessages = messages
      .map((message) => {
        // get nickname if it exists
        let nickname = message.member?.nickname;
        if (nickname) {
          return `${nickname}: ${message.content}`;
        }
        return `${message.author.username}: ${message.content}`;
      })
      .reverse()
      .join('\n');
    let prompt = `${this.prompt}

Previous messages are:
${stringMessages}
End of previous messages.

The user ${username} with the id ${userid} says: ${message}
Only respond with the text. Do not write the username.`;
    console.log(prompt);
    let chat = new Chat({
      apiKey: this.openaiApiKey,
      messages: [
        {
          content: prompt,
          role: 'user',
        },
      ],
    });
    let response = await chat.createChatCompletion();
    if (!response.data.choices[0].message?.content) {
      throw new Error('No prompt was generated');
    }
    let text = response.data.choices[0].message.content;
    return text;
  }
  // TODO
}

// testing

// (async () => {
//   const character = await new Character({
//     name: 'Donald Trump',
//     openaiApiKey: openaiApiKey,
//   }).init();
//   console.log(character.prompt);
//   let response = await character.respondToChat({
//     message: 'Hello',
//     userid: '123',
//     username: 'test',
//   });
//   console.log(response);
// })();
