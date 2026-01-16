import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Party Guest List',
  description: 'Check-in system for party guests',
};

export default function GuestListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
