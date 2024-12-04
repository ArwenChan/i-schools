import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTable1733281054756 implements MigrationInterface {
    name = 'UpdateTable1733281054756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "enroll_pattern"`);
        await queryRunner.query(`ALTER TABLE "school" ADD "enroll_pattern" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "contact"`);
        await queryRunner.query(`ALTER TABLE "school" ADD "contact" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "contact"`);
        await queryRunner.query(`ALTER TABLE "school" ADD "contact" character varying(12) array`);
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "enroll_pattern"`);
        await queryRunner.query(`ALTER TABLE "school" ADD "enroll_pattern" character varying(50) array NOT NULL`);
    }

}
