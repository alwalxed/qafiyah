import type { ReactNode } from 'react';
import { SectionWrapper } from './section-wrapper';

type SectionListProps = {
  children: ReactNode;
  title?: string;
  dynamicTitle?: string;
};

export function SectionList({ title, dynamicTitle, children }: SectionListProps) {
  return (
    <SectionWrapper title={title} dynamicTitle={dynamicTitle}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 xxs:gap-4 w-full">{children}</div>
    </SectionWrapper>
  );
}
