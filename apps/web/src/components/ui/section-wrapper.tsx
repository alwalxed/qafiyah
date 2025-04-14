import type { ReactNode } from 'react';

type SectionWrapperProps = {
  children: ReactNode;
  title?: string;
  dynamicTitle?: string;
};

export function SectionWrapper({ title, dynamicTitle, children }: SectionWrapperProps) {
  const fullTitle = title ? `تصفح ${title}` : '';

  return (
    <section className="w-full flex justify-center items-center flex-col relative overflow-hidden">
      <div className="flex justify-start flex-col items-start gap-6 xs:gap-8 sm:gap-14 w-full 3xl:gap-16">
        <h3 className="text-lg xxs:text-2xl xs:text-4xl xl:text-4xl font-medium">
          {dynamicTitle ? dynamicTitle : fullTitle}
        </h3>
        <div className="grid grid-cols-1 2xl:grid-cols-2 w-full gap-1 sm:gap-4 2xl:gap-6">
          {children}
        </div>
      </div>
    </section>
  );
}
