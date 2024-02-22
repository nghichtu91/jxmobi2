import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Accounts1708505839784 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "accounts",
            columns: [{
                name: "id",
                type: "int",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment'
            }, {
                name: 'username',
                type: "varchar",
            }, {
                name: 'email',
                type: "varchar",
                isNullable: true
            }, {
                name: 'phone',
                type: "varchar",
            },
            {
                name: 'password',
                type: "varchar",
            },
            {
                name: 'coin',
                type: "int",
                default: 0,
            },
            {
                name: 'createAt',
                type: 'datetime',
                isNullable: true
            }]
        }), true)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
