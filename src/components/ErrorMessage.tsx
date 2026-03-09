

export default function ErrorMessage({children} : {children: React.ReactNode}) {
  return (
    <div className="p-3 font-bold text-sm uppercasetext-center bg-red-100 text-red-700">{children}</div>
  )
}
