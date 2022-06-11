export const secondsToHms = (num: number | string, isShort = true) => {
    num = Number(num);
    const h = Math.floor(num / 3600);
    const m = Math.floor((num % 3600) / 60);
    const s = Math.floor((num % 3600) % 60);

    const hour = isShort ? 'h ' : h == 1 ? ' hour ' : ' hours ';
    const minute = isShort ? 'm ' : m == 1 ? ' minute' : ' minutes';
    const second = isShort ? 's ' : s == 1 ? ' second' : ' seconds';

    const hDisplay = h > 0 ? h + hour : '';
    const mDisplay = m > 0 ? m + minute : '';
    const sDisplay = s > 0 ? s + second : '';
    return (hDisplay + mDisplay + sDisplay).trim();
};
