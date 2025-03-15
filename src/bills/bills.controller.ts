import { Controller, Get, Post, Patch, Param, HttpException, HttpStatus } from '@nestjs/common';
import { BillsService } from './bills.service';
import { SupabaseService } from '../services/supabase.service';

@Controller('bills')
export class BillsController {
    constructor(
        private readonly billsService: BillsService,
        private readonly supabaseService: SupabaseService
    ) { }

    @Get()
    async getAllBills() {
        return this.billsService.getAllBills();
    }

    @Post('generate-next-month')
    async generateNextMonthBills() {
        return this.billsService.generateNextMonthBills();
    }

    @Patch(':id/pay')
    async markBillAsPaid(@Param('id') id: string) {
        return this.billsService.markBillAsPaid(id);
    }
}
