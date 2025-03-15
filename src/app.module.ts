import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillsModule } from './bills/bills.module';
import { SupabaseService } from './services/supabase.service';

@Module({
  imports: [BillsModule],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule {}
