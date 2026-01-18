'use client';

import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

const ReactFullpage = dynamic(() => import('@fullpage/react-fullpage'), {
  ssr: false,
});

interface FullpageApi {
  moveTo: (section: number | string, slide?: number) => void;
  moveSectionUp: () => void;
  moveSectionDown: () => void;
  silentMoveTo: (section: number | string, slide?: number) => void;
  setAllowScrolling: (value: boolean, directions?: string) => void;
  setKeyboardScrolling: (value: boolean, directions?: string) => void;
  setAutoScrolling: (value: boolean) => void;
  setScrollingSpeed: (milliseconds: number) => void;
  destroy: (type?: string) => void;
  reBuild: () => void;
  getActiveSection: () => { index: number; item: HTMLElement };
}

interface FullpageSection {
  index: number;
  item: HTMLElement;
  anchor: string;
  isFirst: boolean;
  isLast: boolean;
}

interface FullPageWrapperProps {
  children: (fullpageApi: FullpageApi) => ReactElement;
  onLeave?: (origin: FullpageSection, destination: FullpageSection, direction: string) => void;
}

export default function FullPageWrapper({ children, onLeave }: FullPageWrapperProps) {
  return (
    <ReactFullpage
      licenseKey={'GPLv3'}
      scrollingSpeed={700}
      css3={true}
      easingcss3={'cubic-bezier(0.645, 0.045, 0.355, 1.000)'}
      navigation
      navigationPosition="right"
      showActiveTooltip={false}
      slidesNavigation={false}
      controlArrows={false}
      credits={{ enabled: false }}
      onLeave={onLeave}
      render={({ fullpageApi }) => children(fullpageApi)}
    />
  );
}
