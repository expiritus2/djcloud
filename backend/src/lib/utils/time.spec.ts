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

        it('should convert seconds to minutes with long signs', () => {
            const result1 = secondsToHms(60, false);
            expect(result1).toEqual('1 minute');

            const result2 = secondsToHms(61, false);
            expect(result2).toEqual('1 minute 1 second');

            const result3 = secondsToHms(75, false);
            expect(result3).toEqual('1 minute 15 seconds');

            const result4 = secondsToHms(60 * 60 + 60 * 30 + 15, false);
            expect(result4).toEqual('1 hour 30 minutes 15 seconds');

            const result5 = secondsToHms(60 * 60 * 2 + 60 * 30 + 15, false);
            expect(result5).toEqual('2 hours 30 minutes 15 seconds');

            const result6 = secondsToHms(121, false);
            expect(result6).toEqual('2 minutes 1 second');

            const result7 = secondsToHms(60 * 60, false);
            expect(result7).toEqual('1 hour');
        });
    });
});
