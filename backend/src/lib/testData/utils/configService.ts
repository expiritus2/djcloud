export const getFakeConfigService = () => {
    return {
        get: (variable: string) => {
            switch (variable) {
                case 'SALT':
                    return 'asdf';
                default:
                    return undefined;
            }
        },
    };
};
