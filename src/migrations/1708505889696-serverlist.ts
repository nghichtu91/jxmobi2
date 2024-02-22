import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Serverlist1708505889696 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(new Table({
            name: "serverlist",
            columns: [{
                name: "id",
                type: "int",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment'
            }, {
                name: 'serverId',
                type: "int",
            }, {
                name: 'serverName',
                type: "varchar",
            },
            {
                name: 'serverPort',
                type: "varchar",
                default: '3001'
            },
            {
                name: 'onlineNum',
                type: "int",
                default: 0,
            },
            {
                name: 'isTestServer',
                type: "boolean",
                default: false
            },
            {
                name: 'status',
                type: "int",
                default: 0,
            },
            {
                name: 'createAt',
                type: 'datetime',
                isNullable: true
            }, 
            {
                name: 'maintainStarTime',
                type: 'datetime',
                isNullable: true
            },
            {
                name: 'maintainTerminalTime',
                type: 'datetime',
                isNullable: true
            },
            {
                name: 'maintainTxt',
                type: 'varchar',
                isNullable: true
            }
        ]
        }), true)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
