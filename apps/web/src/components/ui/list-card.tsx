type ListCardProps = {
  name: string;
  title: string;
  href: string;
};

export function ListCard({ name, title, href }: ListCardProps) {
  return (
    <a
      href={href}
      className="hover:cursor-pointer group xxs:gap-2 xs:gap-4 sm:p-8 md:p-10 xs:p-6 p-4 flex-col flex justify-start items-start bg-zinc-100/50 rounded-md border border-zinc-300/50 hover:border-zinc-300/80"
    >
      <h4>
        <p className="text-zinc-800 hover:text-zinc-500 hover:underline duration-300 group-hover:underline-offset-auto group-hover:text-zinc-500 group-hover:underline text-sm xxs:text-base xs:text-2xl sm:text-2xl lg:text-2xl 2xl:text-2xl text-wrap">
          {name.replace(/"/g, '')}
        </p>
      </h4>
      <p className="text-xs xs:text-lg sm:text-xl lg:text-lg text-zinc-600/80 group-hover:text-zinc-500 duration-300 text-wrap">
        {title}
      </p>
    </a>
  );
}
