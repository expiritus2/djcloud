module.exports = class addArchive1675019584265 {
    name = 'addArchive1675019584265';

    async up(queryRunner) {
        await queryRunner.query(`
            alter table tracks
                add archive bool default false;
        `);
    }

    async down(queryRunner) {
        await queryRunner.query('alter table tracks drop column "archive";');
    }
};
