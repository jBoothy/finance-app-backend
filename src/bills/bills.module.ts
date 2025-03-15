import { Module } from '@nestjs/common';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { SupabaseService } from '../services/supabase.service';

@Module({
  controllers: [BillsController],
  providers: [BillsService, SupabaseService], // <-- Register BillsService here
  exports: [BillsService], // <-- Export it if needed elsewhere
})
export class BillsModule {}
