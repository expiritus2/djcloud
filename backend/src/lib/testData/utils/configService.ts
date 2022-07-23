export const getMockConfigService = () => {
    return {
        get: (variable: string): string => {
            switch (variable) {
                case 'SALT':
                    return 'asdf';
                case 'ENVIRONMENT':
                    return 'test';
                case 'TELEGRAM_TOKEN':
                    return 'TELEGRAM_TOKEN';
                case 'TELEGRAM_CHAT_ID':
                    return 'TELEGRAM_CHAT_ID';
                case 'DO_BUCKET_NAME':
                    return 'DO_BUCKET_NAME';
                case 'DO_ACCESS_KEY':
                    return 'DO_ACCESS_KEY';
                case 'DO_SECRET_KEY':
                    return 'DO_SECRET_KEY';
                default:
                    return undefined;
            }
        },
    };
};
