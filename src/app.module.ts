import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './contact/contact.module';
import { SqliteModule } from './sqlite/sqlite.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    SqliteModule,
    ContactModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
