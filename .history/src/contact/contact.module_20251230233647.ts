import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { SqliteModule } from '../sqlite/sqlite.module';

@Module({
  imports: [SqliteModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
