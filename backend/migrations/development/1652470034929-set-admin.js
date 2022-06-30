module.exports = class setAdmin1652470034929 {
    name = 'setAdmin1652470034929';

    async up(queryRunner) {
        queryRunner.query(`
        insert into users (email, password, "roleId")
        values ('test@email.com', '486e9b3962de2e17c1c399596d1ffd508bf163cdaf7ec38cb22694e44c016093',
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
