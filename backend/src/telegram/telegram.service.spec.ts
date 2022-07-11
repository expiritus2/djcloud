import { Test, TestingModule } from '@nestjs/testing';
import { TelegramService } from './telegram.service';
import { ConfigService } from '@nestjs/config';
import { getMockConfigService } from '../lib/testData/utils';

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
    });
});
