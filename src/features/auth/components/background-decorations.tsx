export function BackgroundDecorations() {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed -top-40 -right-40 h-80 w-80 rounded-full
                   bg-brand/50 dark:bg-brand/30
                   blur-3xl pointer-events-none
                   transition-opacity duration-500"
      />
      <div
        aria-hidden="true"
        className="fixed -bottom-40 -left-40 h-80 w-80 rounded-full
                   bg-brand/50 dark:bg-brand/30
                   blur-3xl pointer-events-none
                   transition-opacity duration-500"
      />
      <div
        aria-hidden="true"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   h-[600px] w-[600px] rounded-full
                   bg-brand/30 dark:bg-brand/20
                   blur-3xl pointer-events-none
                   transition-opacity duration-500"
      />
    </>
  )
}