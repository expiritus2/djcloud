console.log('thisthisthis', process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

module.exports = class setAdmin1658005083954 {
    name = 'setAdmin1658005083954';

    async up(queryRunner) {
        queryRunner.query(`
        insert into users (email, password, "roleId")
        values ('fryyystandoff@gmail.com', '7b421e7c97f56e2fe0418bfe6dbd7662cb0ab2b91495e9651fb616953cbbebbd',
                (select id from roles where name = 'admin'))
    `);
    }

    async down(queryRunner) {
        queryRunner.query(`
        delete
        from users
        where email = ${process.env.ADMIN_EMAIL}
          and password = ${process.env.ADMIN_PASSWORD}
    `);
    }
};
