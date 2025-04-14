import { ErasList } from '@/components/sections/eras-list';
import { MetersList } from '@/components/sections/meters-list';
import { PoetsList } from '@/components/sections/poets-list';
import { RhymesList } from '@/components/sections/rhymes-list';

export default function Page() {
  return (
    <div className="overflow-x-hidden h-full flex flex-col justify-start items-start w-full gap-12 xs:gap-24 md:gap-32">
      <ErasList />
      <MetersList />
      <PoetsList />
      <RhymesList />
    </div>
  );
}
