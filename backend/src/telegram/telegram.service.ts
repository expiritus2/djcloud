import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ITelegramOptions } from './telegram.interface';
import { ConfigService } from '@nestjs/config';
import * as tt from 'telegraf/src/telegram-types';

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

    async sendMessage(message: string, chatId: string = this.options.chatId) {
        await this.bot.telegram.sendMessage(chatId, message);
    }

    async sendAudio(url: string, extra: tt.ExtraAudio = {}, chatId: string = this.options.chatId) {
        await this.bot.telegram.sendAudio(chatId, url, extra);
    }

    async sendDocument(url: string, extra: tt.ExtraAudio = {}, chatId: string = this.options.chatId) {
        await this.bot.telegram.sendDocument(chatId, url, extra);
    }
}
