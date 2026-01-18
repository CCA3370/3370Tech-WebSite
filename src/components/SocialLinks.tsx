'use client';

import { Github, Twitter, Plane } from 'lucide-react';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/CCA3370',
    icon: <Github className="w-6 h-6" />,
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/3370tech',
    icon: <Twitter className="w-6 h-6" />,
  },
  {
    name: 'X-Plane.org',
    url: 'https://forums.x-plane.org/profile/1288218-3370/',
    icon: <Plane className="w-6 h-6" />,
  },
];

export default function SocialLinks() {
  return (
    <div className="flex gap-4 justify-center">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
          style={{
            backgroundColor: 'var(--card-bg)',
            color: 'var(--foreground)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--card-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--card-bg)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          aria-label={link.name}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
