module.exports = class setAdmin1652470034929 {
    name = 'setAdmin1652470034929';

    async up(queryRunner) {
        queryRunner.query(`
        insert into users (email, password, "roleId")
        values ('test@email.com', '6bc5655cd635355edbdc640c3809210770b89dcc36d66a1a687ee2b8c39208e6',
                (select id from roles where name = 'admin'))
    `);
    }

    async down(queryRunner) {
        queryRunner.query(`
        delete
        from users
        where email = 'test@email.com'
          and password = '6bc5655cd635355edbdc640c3809210770b89dcc36d66a1a687ee2b8c39208e6'
    `);
    }
};
