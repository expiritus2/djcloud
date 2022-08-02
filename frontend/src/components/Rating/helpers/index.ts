import { ScreenType } from 'hooks/use-resize';
import { MOBILE_SMALL } from 'settings/constants/screen';

export const createStars = (screen: ScreenType, isNumbers: boolean) => {
    let array = new Array(10);

    const isMobile = screen.width <= MOBILE_SMALL && !isNumbers;
    if (isMobile) {
        array = new Array(1);
    }

    return array.fill(null);
};
