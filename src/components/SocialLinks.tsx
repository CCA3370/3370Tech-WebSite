'use client';

import { Github } from 'lucide-react';
import Image from 'next/image';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  gap?: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/CCA3370',
    icon: <Github className="w-7 h-7" />,
    color: 'from-gray-600 to-gray-800',
    hoverColor: 'from-gray-700 to-gray-900',
    gap: 'gap-2',
  },
  {
    name: 'X-Plane.org',
    url: 'https://forums.x-plane.org/profile/1288218-3370/',
    icon: <Image src="/images/xplane.png" alt="X-Plane.org" width={36} height={36} className="w-9 h-9 object-contain" />,
    color: 'from-green-500 to-emerald-600',
    hoverColor: 'from-green-600 to-emerald-700',
    gap: 'gap-0',
  },
];

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-4 sm:gap-5 justify-center">
      {socialLinks.map((link, index) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
          aria-label={link.name}
        >
          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${link.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>

          {/* Button */}
          <div className={`relative flex flex-col items-center ${link.gap || 'gap-2'} p-5 sm:p-6 rounded-2xl bg-gradient-to-br ${link.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 min-w-[120px] sm:min-w-[140px]`}>
            <div className="transform group-hover:scale-110 transition-transform duration-300">
              {link.icon}
            </div>
            <span className="text-sm font-semibold">{link.name}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
