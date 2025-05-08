import type { ReactNode } from 'react';
import { SectionWrapper } from './section-wrapper';

type SectionListProps = {
  noTitle?: boolean;
  children: ReactNode;
  title?: string;
  dynamicTitle?: string;
  customMargin?: string
};

export function SectionList({
  title,
  dynamicTitle,
  children,
  noTitle,
  customMargin
}: SectionListProps) {
  return (
    <SectionWrapper
      title={title}
      dynamicTitle={dynamicTitle}
      noTitle={noTitle}
      customMargin={customMargin}
    >
      {children}
    </SectionWrapper>
  );
}
