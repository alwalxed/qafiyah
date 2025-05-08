import { cn } from '@/utils/conversions/cn';
import type { ReactNode } from 'react';
import { PaginationLink } from './pagination-link';

type SectionWrapperProps = {
  children: ReactNode;
  title?: string;
  dynamicTitle?: string;
  noTitle?: boolean;
  customMargin?: string;
  pagination?: {
    totalPages: number;
    component: ReactNode;
  };
};

export function SectionWrapper({
  title,
  dynamicTitle,
  children,
  pagination,
  noTitle,
  customMargin,
}: SectionWrapperProps) {
  const fullTitle = title ? `تصفح ${title}` : '';

  return (
    <section
      className={cn(
        'w-full flex justify-center items-center flex-col relative overflow-hidden my-14 xs:my-20 lg:my-28',
        customMargin
      )}
    >
      <div className="flex justify-start flex-col items-start gap-6 xs:gap-8 sm:gap-14 w-full 3xl:gap-16">
        {noTitle ? null : (
          <h3 className="text-lg xxs:text-2xl xs:text-4xl xl:text-4xl font-medium">
            {dynamicTitle ? dynamicTitle : fullTitle}
          </h3>
        )}
        <div className="grid grid-cols-1 2xl:grid-cols-2 w-full gap-1 sm:gap-4 2xl:gap-6">
          {children}
        </div>
        {pagination?.totalPages
          ? pagination?.totalPages > 1
            ? pagination?.component
            : null
          : null}
      </div>
    </section>
  );
}

type SectionPaginationControllersProps = {
  headerTip: string;
  nextPageUrl: string;
  prevPageUrl: string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export function SectionPaginationControllers({
  headerTip,
  nextPageUrl,
  prevPageUrl,
  hasNextPage,
  hasPrevPage,
}: SectionPaginationControllersProps) {
  return (
    <nav className="flex flex-row-reverse w-full justify-between items-center gap-4 text-base md:text-lg mt-8">
      <PaginationLink href={nextPageUrl} isDisabled={!hasNextPage} prefetch={hasNextPage}>
        {'التالي'}
      </PaginationLink>

      <p className="text-zinc-500 text-base">{headerTip}</p>

      <PaginationLink href={prevPageUrl} isDisabled={!hasPrevPage} prefetch={hasPrevPage}>
        {'السابق'}
      </PaginationLink>
    </nav>
  );
}
