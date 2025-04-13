import Link from 'next/link';

type Props = {
  name: string;
  title: string;
  href: string;
};

export function ListCard({ name, title, href }: Props) {
  return (
    <div className="hover:cursor-pointer group xs:p-10 p-4 flex-col xs:flex-row flex xs:justify-between justify-start items-start xs:items-center bg-zinc-100/50 rounded-md border border-zinc-300/50 hover:border-zinc-300/80">
      <h4>
        <Link
          href={href}
          className="text-zinc-800 hover:text-zinc-500 hover:underline duration-300 group-hover:underline-offset-auto group-hover:text-zinc-500 group-hover:underline text-sm xxs:text-lg lg:text-xl xl:text-2xl truncate"
        >
          {name.replace(/"/g, '')}
        </Link>
      </h4>
      <p className="text-xs xxs:text-base lg:text-lg text-zinc-600/80 group-hover:text-zinc-500 duration-300 truncate">
        {title}
      </p>
    </div>
  );
}
