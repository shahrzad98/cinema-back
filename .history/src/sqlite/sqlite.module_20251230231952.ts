import { Module } from '@nestjs/common';
import { SqliteService } from './sqlite.service.ts';

@Module({
  providers: [SqliteService],
  exports: [SqliteService],
})
export class SqliteModule {}
