import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import * as tt from 'telegraf/src/telegram-types';

import { ITelegramOptions } from './telegram.interface';

@Injectable()
export class TelegramService {
  bot: Telegraf;
  options: ITelegramOptions;

  constructor(private configService: ConfigService) {
    this.options = {
      token: configService.get('TELEGRAM_TOKEN'),
      chatId: configService.get('TELEGRAM_CHAT_ID'),
    };
    this.bot = new Telegraf(this.options.token);
  }

  async sendMessage(message: string, extra?: tt.ExtraReplyMessage, chatId: string = this.options.chatId) {
    await this.bot.telegram.sendMessage(chatId, message, extra);
  }

  async sendAudio(url: string, extra: tt.ExtraAudio = {}, chatId: string = this.options.chatId) {
    await this.bot.telegram.sendAudio(chatId, url, extra);
  }
}
