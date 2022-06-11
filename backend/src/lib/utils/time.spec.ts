import { secondsToHms } from './time';

describe('Time utils', () => {
    describe('secondsToHms', () => {
        it('should convert seconds to minutes', () => {
            const result1 = secondsToHms(60);
            expect(result1).toEqual('1m');

            const result2 = secondsToHms(75);
            expect(result2).toEqual('1m 15s');

            const result3 = secondsToHms(60 * 60 + 60 * 30 + 15);
            expect(result3).toEqual('1h 30m 15s');
        });
    });
});
