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
      {children}
    </SectionWrapper>
  );
}
