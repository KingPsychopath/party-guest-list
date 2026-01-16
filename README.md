# Party Guest List Check-in App

A real-time, mobile-first web application for door staff to check in party guests. Built with Next.js, TypeScript, and Vercel KV for shared state across multiple devices.

## Features

- ✅ Real-time check-in/check-out with shared state across devices
- 🔍 Search and filter guests by name, status, or check-in state
- 👥 Manage guest relationships (main guests and +1's)
- 📊 Live statistics showing checked-in counts
- 📱 Mobile-first design with touch-friendly interface
- 📤 CSV import for bulk guest loading
- ➕ Add/remove guests on the fly

## Setup

### Prerequisites

- Node.js 18+ and pnpm
- Vercel account (for production hosting and KV database)

### Local Development (No KV Required)

The app includes **in-memory storage fallback** for local development. You can test everything without setting up Vercel KV:

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Then open [http://localhost:3000/guestlist](http://localhost:3000/guestlist)

**Note:** In local mode, data is stored in memory and will reset when you restart the server. This is perfect for testing!

### Production Setup (With Vercel KV)

For persistent storage across devices:

1. Go to your Vercel project dashboard
2. Create a new KV database (Storage → Create → KV)
3. Copy the credentials and add to `.env.local`:

```bash
KV_REST_API_URL=your_url_here
KV_REST_API_TOKEN=your_token_here
```

4. Restart the dev server - it will now use Vercel KV

## Usage

### Auto-Loading Guest List (Recommended)

Place your CSV file at `public/guests.csv` and the app will auto-load it on first visit.

### Manual CSV Import

1. Click **Manage** (bottom right)
2. Enter the password: `party2026`
3. Go to **Import CSV** tab
4. Upload your Partiful CSV export

### CSV Format

The app expects Partiful's export format:
- `Name`, `Status`, `RSVP date`, `Did you enter your full name?`, `Is Plus One Of`
- Guest relationships (+1s) are automatically parsed

### Checking In Guests

- Tap the checkbox to check someone in
- Tap the arrow to expand and see their guests (+1s)
- Check-in timestamps are recorded automatically

### Managing Guests (Password Protected)

- Tap **Manage** (bottom right) → Enter password `party2026`
- **Add Guest**: Add new guests or +1s (typeahead search for linking)
- **Remove**: Search and remove guests
- **Import CSV**: Upload new guest lists

### Search and Filters

- Search by name across all guests
- Filter: All, Invites, Guests (+1s), Inside (checked in), Waiting
- Results show match counts

## Deployment

1. Push to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
4. Deploy and configure your domain (e.g., `milkandhenny.com/guestlist`)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Storage**: Vercel KV (Redis) or in-memory fallback
- **CSV Parsing**: PapaParse

## Architecture

- **Polling**: Client-side polling every 2.5 seconds for sync
- **Optimistic Updates**: Instant UI feedback
- **Mobile-First**: Large touch targets, responsive design
- **Password Protected**: Management features behind `party2026`
- **Auto-Bootstrap**: Loads `public/guests.csv` on first visit

## Customization

### Change the Management Password

Edit `components/guestlist/GuestManagement.tsx`:
```typescript
const MANAGEMENT_PASSWORD = 'your-password-here';
```

### Pre-load Guest List

Copy your Partiful CSV export to `public/guests.csv` before deploying.
