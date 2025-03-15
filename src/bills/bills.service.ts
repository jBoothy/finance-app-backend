import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../services/supabase.service';

@Injectable()
export class BillsService {
    private readonly logger = new Logger(BillsService.name);

    constructor(private readonly supabaseService: SupabaseService) { }

    async getAllBills() {
        const { data, error } = await this.supabaseService.getClient().from('bills').select('*');
        if (error) throw new Error(error.message);
        return data;
    }

    async generateNextMonthBills() {
        const supabase = this.supabaseService.getClient();

        // Get current date & next month's first day
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const nextMonthStr = nextMonth.toISOString().split('T')[0]; // YYYY-MM-DD format

        // Fetch current month's bills
        const { data: currentBills, error } = await supabase
            .from('bills')
            .select('*')
            .gte('due_date', `${today.getFullYear()}-${today.getMonth() + 1}-01`)
            .lt('due_date', `${today.getFullYear()}-${today.getMonth() + 2}-01`);

        if (error) {
            this.logger.error('Error fetching current bills:', error.message);
            throw new Error(error.message);
        }

        if (!currentBills || currentBills.length === 0) {
            this.logger.log('No bills found for the current month.');
            return { message: 'No bills to copy' };
        }

        // Check if next month's bills already exist
        const { data: nextMonthBills } = await supabase
            .from('bills')
            .select('id')
            .gte('due_date', nextMonthStr)
            .lt('due_date', `${nextMonth.getFullYear()}-${nextMonth.getMonth() + 2}-01`);

        if (nextMonthBills && nextMonthBills.length > 0) {
            this.logger.log('Next month’s bills already exist. No new bills generated.');
            return { message: 'Bills for next month already exist' };
        }

        // Prepare new bill entries
        const newBills = currentBills.map((bill) => ({
            name: bill.name,
            due_date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), bill.due_date.split('-')[2])
                .toISOString()
                .split('T')[0], // Keep same day of month
            amount: bill.amount,
            paid: false,
            set_aside: false,
            remaining: bill.remaining || 0, // Carry over remaining balance if it's a debt
            notes: bill.notes,
        }));

        // Insert new bills for next month
        const { data: insertedBills, error: insertError } = await supabase
            .from('bills')
            .insert(newBills);

        if (insertError) {
            this.logger.error('Error inserting next month’s bills:', insertError.message);
            throw new Error(insertError.message);
        }

        this.logger.log(`Generated ${newBills.length} new bills for next month.`);
        return { message: `Generated ${newBills.length} new bills` };
    }

    async markBillAsPaid(id: string) {
        const { error } = await this.supabaseService.getClient()
            .from('bills')
            .update({ paid: true })
            .eq('id', id);

        if (error) throw new Error(error.message);
        return { message: `Bill ${id} marked as paid.` };
    }
}
