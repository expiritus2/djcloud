// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config();

console.log('thisthisthis', process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

module.exports = class setAdmin1658005083954 {
    name = 'setAdmin1658005083954';

    async up(queryRunner) {
        queryRunner.query(`
        insert into users (email, password, "roleId")
        values (${process.env.ADMIN_EMAIL}, ${process.env.ADMIN_PASSWORD},
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
