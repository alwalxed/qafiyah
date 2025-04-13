type ErrorMessageProps = {
  message?: string
}

export function ErrorMessage({ message = "حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى." }: ErrorMessageProps) {
  return <div className="text-red-500 text-center py-8">{message}</div>
}
