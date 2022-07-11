export const getMockConfigService = () => {
    return {
        get: (variable: string) => {
            switch (variable) {
                case 'SALT':
                    return 'asdf';
                case 'NODE_ENV':
                    return 'test';
                default:
                    return undefined;
            }
        },
    };
};
