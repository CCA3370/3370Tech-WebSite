import { redirect } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

export function generateMetadata() {
  return {
    title: 'My Products - Showcase',
    description: 'Discover amazing software solutions',
  };
}
