module.exports = class addStatsSchema1660249619911 {
    name = 'addStatsSchema1660249619911';

    async up(queryRunner) {
        await queryRunner.query(`
            create table stats
            (
                id            serial
                    constraint stats_pk
                        primary key,
                "trackId"     int references tracks (id) on delete cascade,
                "listenCount" int
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query('drop table stats');
    }
};
