import { NextResponse } from 'next/server';
import { parseCSV } from '@/lib/csv-parser';
import { getGuests, setGuests } from '@/lib/kv-client';
import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Bootstrap endpoint - loads guests from public/guests.csv if no guests exist
 * This runs on first load to populate the list automatically
 */
export async function POST() {
  try {
    // Check if guests already exist
    const existingGuests = await getGuests();
    if (existingGuests.length > 0) {
      return NextResponse.json({ 
        bootstrapped: false, 
        message: 'Guests already exist',
        count: existingGuests.length 
      });
    }

    // Try to load from public/guests.csv
    const csvPath = join(process.cwd(), 'public', 'guests.csv');
    
    try {
      const csvContent = await readFile(csvPath, 'utf-8');
      const guests = parseCSV(csvContent);
      await setGuests(guests);
      
      return NextResponse.json({ 
        bootstrapped: true, 
        message: 'Loaded guests from CSV',
        count: guests.length 
      });
    } catch (fileError) {
      // File doesn't exist, that's okay
      return NextResponse.json({ 
        bootstrapped: false, 
        message: 'No guests.csv found in public folder',
        count: 0 
      });
    }
  } catch (error) {
    console.error('Bootstrap error:', error);
    return NextResponse.json({ error: 'Bootstrap failed' }, { status: 500 });
  }
}
