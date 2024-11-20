import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MyLoggerService } from '../logger/logger.service';
import { DataSource } from 'typeorm';

@Injectable()
export class TasksService {
  private readonly logger = new MyLoggerService(TasksService.name);
  constructor(private readonly datasource: DataSource) {}

  @Cron('5 2 * * * ', {
    name: 'update-schools-rating',
    timeZone: 'Asia/Shanghai',
  }) // run at 2:05 am, every day
  async handleRatings() {
    this.logger.log('running corn task');
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`
WITH R AS (
SELECT "schoolId" AS SCHOOLID, COUNT(*) AS NUM, AVG(RATING) AS AVGRATING
FROM PUBLIC.COMMENTS
GROUP BY SCHOOLID
),
CC AS (
SELECT DISTINCT ON (SCHOOLID)
	"schoolId" AS SCHOOLID, LIKES, CONTENT FROM PUBLIC.COMMENTS ORDER BY SCHOOLID, LIKES DESC
)
	UPDATE SCHOOL
SET RATING = R.AVGRATING,
	COMMENT_COUNT = R.NUM,
	COMMENT_BEST = CC.CONTENT
FROM R INNER JOIN CC ON R.SCHOOLID=CC.SCHOOLID
WHERE SCHOOL.ID = R.SCHOOLID AND SCHOOL.COMMENT_COUNT <> R.NUM;
`);
      await queryRunner.commitTransaction();
      this.logger.log('finished corn task');
    } catch (error) {
      this.logger.error(error);
      queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release(); // release the db connection
    }
  }
}
