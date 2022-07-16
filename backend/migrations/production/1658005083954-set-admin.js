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
        where email = 'test@email.com'
          and password = '486e9b3962de2e17c1c399596d1ffd508bf163cdaf7ec38cb22694e44c016093'
    `);
    }
};
