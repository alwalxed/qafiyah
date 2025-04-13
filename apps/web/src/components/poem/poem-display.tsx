import { toArabicDigits } from "@/lib/utils"
import type { Metadata } from "next"
import Link from "next/link"

export type PoemProps = {
  clearTitle: string
  data: {
    poet_name: string
    poet_slug: string
    era_name: string
    era_slug: string
    meter_name: string
    theme_name: string
    type_name?: string
  }
  verses: string[][]
  verseCount: string | number
  metadata: Metadata
}

export function PoemDisplay({ clearTitle, data, verses, verseCount }: PoemProps) {
  return (
    <article className="w-full flex justify-center items-center">
      <div className="w-full flex flex-col gap-12 justify-center items-center">
        {/* Header */}
        <header className="flex justify-center items-center flex-col gap-4 xxs:gap-6 text-center w-full">
          <div className="flex flex-col gap-2 xx:gap-4">
            <h1 className="text-lg xxs:text-2xl md:text-3xl font-bold text-zinc-800">{clearTitle}</h1>

            <h2 className="text-sm xxs:text-base md:text-2xl text-zinc-700">
              <Link href={`/poets/${data.poet_slug}/page/1`} className="hover:underline">
                {data.poet_name}
              </Link>{" "}
              <a href={`/eras/${data.era_slug}/page/1`} className="hover:underline">
                {`(${data.era_name})`}
              </a>
            </h2>
          </div>

          <div className="flex w-full md:w-8/12 border border-zinc-300/80 px-2.5 md:px-8 lg:px-16 divide-x text-[10px] xxs:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl justify-between items-center text-zinc-500/90 rounded-full divide-zinc-300/80">
            <p className="flex-1 py-0.5 md:py-1 lg:py-1.5">{data.meter_name}</p>
            <p className="flex-1 py-0.5 md:py-1 lg:py-1.5">{toArabicDigits(verseCount)}</p>
            <p className="flex-1 py-0.5 md:py-1 lg:py-1.5">{data.theme_name}</p>
            {data.type_name && <p className="flex-1 py-0.5 md:py-1 lg:py-1.5">{data.type_name}</p>}
          </div>
        </header>

        {/* Content */}
        <div className="relative flex flex-col justify-between items-center bg-white py-1 md:py-8 lg:py-16 px-4 rounded-2xl gap-8 w-full md:w-10/12 xl:w-9/12">
          <div className="flex flex-col items-center w-full">
            <div className="w-full xxs:w-8/12 md:w-9/12 lg:w-8/12 xl:w-6/12">
              {verses.map((verse, index) => (
                <div
                  key={index}
                  className="py-6 md:py-8 border-b border-zinc-50 last:border-b-0 flex flex-col w-full justify-center items-center gap-4"
                >
                  <p className="text-sm md:text-xl lg:text-2xl text-right w-full" lang="ar" dir="rtl">
                    {verse[0]}
                  </p>
                  <p className="text-sm md:text-xl lg:text-2xl text-left w-full" lang="ar" dir="rtl">
                    {verse[1]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
