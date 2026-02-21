export function SectionWrapper({ show, children }: { show?: boolean; children: React.ReactNode }) {
  if (show === false) return null
  return <>{children}</>
}
