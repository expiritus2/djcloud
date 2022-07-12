export const getMockConfigService = () => {
    return {
        get: (variable: string) => {
            switch (variable) {
                case 'SALT':
                    return 'asdf';
                case 'NODE_ENV':
                    return 'test';
                case 'TELEGRAM_TOKEN':
                    return 'TELEGRAM_TOKEN';
                case 'TELEGRAM_CHAT_ID':
                    return 'TELEGRAM_CHAT_ID';
                case 'DO_BUCKET_NAME':
                    return 'DO_BUCKET_NAME';
                default:
                    return undefined;
            }
        },
    };
};
