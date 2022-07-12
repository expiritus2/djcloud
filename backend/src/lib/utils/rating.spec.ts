import { averageRating } from './rating';

describe('averageRating', () => {
    it('should return average rating rounded to more', () => {
        const ratings = [1, 2, 5];
        const result = averageRating(ratings);
        expect(result).toEqual(3);
    });

    it('should return average rating rounded to less', () => {
        const ratings = [1, 2, 4];
        const result = averageRating(ratings);
        expect(result).toEqual(2);
    });

    it('should return exact rating if it is only one rating', () => {
        const ratings = [10];
        const result = averageRating(ratings);
        expect(result).toEqual(10);
    });

    it('should return 0 if no ratings', () => {
        const ratings = [];
        const result = averageRating(ratings);
        expect(result).toEqual(0);
    });
});
