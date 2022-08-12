module.exports = class addListenStatsSchema1660249619911 {
    name = 'addListenStatsSchema1660249619911';

    async up(queryRunner) {
        await queryRunner.query(`
            create table "listenStats"
            (
                id            serial
                    constraint listenstats_pk
                        primary key,
                "trackId"     int references tracks (id) on delete cascade,
                "listenCount" int
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query('drop table "listenStats"');
    }
};
