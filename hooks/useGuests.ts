'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Guest } from '@/lib/types';

export function useGuests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasBootstrapped = useRef(false);

  const fetchGuests = useCallback(async () => {
    try {
      const res = await fetch('/api/guests');
      if (!res.ok) throw new Error('Failed to fetch guests');
      const data = await res.json();
      setGuests(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Bootstrap from public/guests.csv on first load
  const bootstrap = useCallback(async () => {
    if (hasBootstrapped.current) return;
    hasBootstrapped.current = true;
    
    try {
      const res = await fetch('/api/guests/bootstrap', { method: 'POST' });
      const data = await res.json();
      if (data.bootstrapped) {
        console.log(`Bootstrapped ${data.count} guests from CSV`);
      }
    } catch (err) {
      console.warn('Bootstrap failed:', err);
    }
  }, []);

  useEffect(() => {
    // Try bootstrap first, then fetch
    bootstrap().then(() => fetchGuests());
    
    const interval = setInterval(fetchGuests, 2500);
    return () => clearInterval(interval);
  }, [fetchGuests, bootstrap]);

  const updateCheckIn = useCallback(async (id: string, checkedIn: boolean) => {
    const previousGuests = guests;
    
    // Optimistic update
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return { ...g, checkedIn, checkedInAt: checkedIn ? new Date().toISOString() : undefined };
        }
        if (g.plusOnes) {
          return {
            ...g,
            plusOnes: g.plusOnes.map((p) =>
              p.id === id
                ? { ...p, checkedIn, checkedInAt: checkedIn ? new Date().toISOString() : undefined }
                : p
            ),
          };
        }
        return g;
      })
    );

    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, checkedIn }),
      });
      if (!res.ok) {
        setGuests(previousGuests);
        throw new Error('Failed to update check-in');
      }
    } catch (err) {
      setGuests(previousGuests);
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  }, [guests]);

  return { guests, loading, error, updateCheckIn, refetch: fetchGuests };
}
