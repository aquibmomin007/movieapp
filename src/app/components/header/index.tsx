type Props = {
  disabled: boolean;
  children: React.ReactNode;
}

export default function({ children, disabled }: Props) {
  return (
    <section className={`flex flex-row items-center justify-between w-full bg-white h-20 w-[inherit] px-8 py-4 top-0 fixed ${disabled ? "pointer-events-none	opacity-25" : ""}`}>
      {children}
    </section>
  )
}