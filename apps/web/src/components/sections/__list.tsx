import type { ReactNode } from 'react';
import { SectionWrapper } from './__wrapper';

type Props = {
  children: ReactNode;
  title?: string;
  dynamicTitle?: string;
};
export function SectionList({ title, dynamicTitle, children }: Props) {
  return (
    <SectionWrapper title={title} dynamicTitle={dynamicTitle}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 xxs:gap-4 w-full">{children}</div>
    </SectionWrapper>
  );
}
