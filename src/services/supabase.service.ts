import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
    private supabase: SupabaseClient;

    onModuleInit() {
        // Load env variables
        const url = process.env.SUPABASE_URL!;
        const key = process.env.SUPABASE_KEY!;

        if (!url || !key) {
            throw new Error('Supabase URL or Key not set!');
        }

        // Create the Supabase client
        this.supabase = createClient(url, key);
    }

    getClient(): SupabaseClient {
        return this.supabase;
    }
}
