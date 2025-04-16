type Props = {
  itemsCount: number;
  title: string;
};

export function SectionSkeleton({ itemsCount, title }: Props) {
  const items = Array.from({ length: itemsCount }, (_, index) => index);

  return (
    <section className="w-full flex justify-center items-center flex-col relative overflow-hidden my-14 xs:my-20 lg:my-28">
      <div className="flex justify-start flex-col items-start gap-6 xs:gap-8 sm:gap-14 w-full 3xl:gap-16">
        <h3 className="text-lg xxs:text-2xl xs:text-4xl xl:text-4xl font-medium">{title}</h3>
        <div className="grid grid-cols-1 2xl:grid-cols-2 w-full gap-1 sm:gap-4 2xl:gap-6">
          {items.map((index) => (
            <div
              key={index}
              className="w-full h-20 xl:h-32 bg-zinc-200/70 animate-pulse rounded-md"
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
