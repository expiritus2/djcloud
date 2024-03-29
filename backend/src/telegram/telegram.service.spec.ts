import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { getMockConfigService } from '../lib/testData/utils';

import { TelegramService } from './telegram.service';

jest.mock('telegraf', () => ({
  Telegraf: jest.fn().mockImplementation(() => {
    return {
      telegram: {
        sendMessage: jest.fn(),
        sendAudio: jest.fn(),
      },
    };
  }),
}));

describe('TelegramService', () => {
  let service: TelegramService;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(async () => {
    mockConfigService = getMockConfigService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegramService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TelegramService>(TelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service.options).toEqual({
      chatId: 'TELEGRAM_CHAT_ID',
      token: 'TELEGRAM_TOKEN',
    });
    expect(service.bot).toEqual({
      telegram: {
        sendAudio: expect.any(Function),
        sendMessage: expect.any(Function),
      },
    });
  });

  describe('sendMessage', () => {
    it('should send message to telegram with default chatId', async () => {
      await service.sendMessage('Some message', {});

      expect(service.bot.telegram.sendMessage).toBeCalledWith(service.options.chatId, 'Some message', {});
    });

    it('should send message to telegram with custom chatId', async () => {
      await service.sendMessage('Some message', {}, 'customChatId');

      expect(service.bot.telegram.sendMessage).toBeCalledWith('customChatId', 'Some message', {});
    });
  });

  describe('sendAudio', () => {
    it('should send audion to telegram with default chatId', async () => {
      const url = 'http://example.com/test.mp3';
      await service.sendAudio(url);
      expect(service.bot.telegram.sendAudio).toBeCalledWith(service.options.chatId, url, {});
    });

    it('should send audion to telegram with custom chatId', async () => {
      const url = 'http://example.com/test.mp3';
      await service.sendAudio(url, {}, 'customChatId');
      expect(service.bot.telegram.sendAudio).toBeCalledWith('customChatId', url, {});
    });

    it('should send audion to telegram with extra info', async () => {
      const url = 'http://example.com/test.mp3';
      const extra = { title: 'Title', duration: 400.56 };
      await service.sendAudio(url, extra);
      expect(service.bot.telegram.sendAudio).toBeCalledWith(service.options.chatId, url, extra);
    });
  });
});
