import { redirect } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

export function generateMetadata() {
  return {
    title: 'My Products - Showcase',
    description: 'Discover amazing software solutions',
  };
}
