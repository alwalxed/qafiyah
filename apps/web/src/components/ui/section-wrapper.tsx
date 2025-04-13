import type { ReactNode } from "react"

type SectionWrapperProps = {
  children: ReactNode
  title?: string
  dynamicTitle?: string
}

export function SectionWrapper({ title, dynamicTitle, children }: SectionWrapperProps) {
  const fullTitle = title ? `تصفح ${title}` : ""

  return (
    <section className="w-full flex justify-center items-center flex-col relative overflow-hidden">
      <div className="flex justify-start flex-col items-start gap-6 xxs:gap-8 w-full">
        <h3 className="text-lg xxs:text-2xl xl:text-3xl font-medium">{dynamicTitle ? dynamicTitle : fullTitle}</h3>
        {children}
      </div>
    </section>
  )
}
