'use client';

import { Github, Twitter, Plane } from 'lucide-react';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/CCA3370',
    icon: <Github className="w-6 h-6" />,
    color: 'from-gray-600 to-gray-800',
    hoverColor: 'from-gray-700 to-gray-900',
  },
  {
    name: 'X-Plane.org',
    url: 'https://forums.x-plane.org/profile/1288218-3370/',
    icon: <Plane className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-600',
    hoverColor: 'from-green-600 to-emerald-700',
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
          <div className={`relative flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl bg-gradient-to-br ${link.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 min-w-[120px] sm:min-w-[140px]`}>
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
