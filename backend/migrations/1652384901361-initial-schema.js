module.exports = class initialSchema1652384901361 {
    name = 'initialSchema1652384901361';

    async up(queryRunner) {
        await queryRunner.query(`
        CREATE OR REPLACE FUNCTION set_updatedAt() RETURNS trigger AS
        $set_updatedAt$
        BEGIN
            IF NEW."updatedAt" = OLD."updatedAt" THEN
                NEW."updatedAt" = NOW();
            END IF;
            RETURN NEW;
        END;
        $set_updatedAt$ LANGUAGE plpgsql;
    `);
        await queryRunner.query(`
            create table genres
            (
                id    serial
                    constraint genres_pk primary key,
                name  varchar(300) not null,
                value varchar(300) not null
            );`);
        await queryRunner.query(`
            create table categories
            (
                id    serial
                    constraint categories_pk primary key,
                name  varchar(300) not null,
                value varchar(300) not null
            );`);
        await queryRunner.query(`create type rolesEnum as enum ('admin', 'user');`);
        await queryRunner.query(`
            create table roles
            (
                id   serial
                    constraint roles_pk primary key,
                name rolesEnum not null default 'admin'
            );`);
        await queryRunner.query(`
            insert into roles (name)
            values ('admin'),
                   ('user')
        `);
        await queryRunner.query(`
            create table users
            (
                id          serial
                    constraint users_pk primary key,
                email       varchar(300) not null unique,
                password    varchar(300),
                "createdAt" timestamp    not null default current_timestamp,
                "updatedAt" timestamp    not null default current_timestamp,
                "roleId"    int references roles (id)
            );`);
        await queryRunner.query(
            `CREATE TRIGGER table_update BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE PROCEDURE set_updatedAt();`,
        );
        await queryRunner.query(`
            create table files
            (
                id       serial
                    constraint files_pk primary key,
                name     varchar(300) not null,
                url      text         not null,
                size     int          not null,
                mimetype varchar(300) not null
            )
        `);
        await queryRunner.query(`
            create table tracks
            (
                id           serial
                    constraint tracks_pk
                        primary key,
                title        varchar(300) not null,
                visible      boolean   default true,
                duration     float        not null,
                "fileId"     int references files (id),
                "categoryId" int references categories (id),
                "genreId"    int          references genres (id) on delete set null,
                "createdAt"  timestamp default current_timestamp,
                "updatedAt"  timestamp default current_timestamp
            );
        `);
        await queryRunner.query(`
            create table "trackRatings"
            (
                id        serial
                    constraint trackRatings_pk
                        primary key,
                "trackId" int references tracks (id) on delete cascade,
                rating    float not null
            )
        `);
        await queryRunner.query(
            `CREATE TRIGGER table_update BEFORE UPDATE ON "tracks" FOR EACH ROW EXECUTE PROCEDURE set_updatedAt();`,
        );
    }

    async down(queryRunner) {
        await queryRunner.query('drop table "trackRatings"');
        await queryRunner.query('drop table tracks');
        await queryRunner.query('drop table files');
        await queryRunner.query('drop table genres');
        await queryRunner.query('drop table categories');
        await queryRunner.query('drop table users');
        await queryRunner.query('drop table roles');
        await queryRunner.query('drop type rolesEnum');
        await queryRunner.query('drop function set_updatedAt');
    }
};
