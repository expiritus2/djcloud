module.exports = class addCreateZipStatus1669740277471 {
    name = 'addCreateZipStatus1669740277471';

    async up(queryRunner) {
        await queryRunner.query(`
            create table "createZipStatus"
            (
                id           serial
                    constraint createzipstatus_pk
                        primary key,
                "isFinished" boolean default false,
                "pathToFile" varchar(300) not null,
                progress float default 0,
                "countFiles" int default null
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query('drop table "createZipStatus"');
    }
};
