import type React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4d8d2]">
      <div className="flex-1 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-normal tracking-wide">GENSYN TESTNET DASHBOARD</h1>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="border border-[#260f06] p-4 sm:p-8 bg-[#f4d8d2]">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-normal text-center">{title}</h2>
              {subtitle && <p className="mt-2 text-xs sm:text-sm text-center">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-xs sm:text-sm">
        <p>
          Crafted by{" "}
          <a href="https://x.com/0xemir_" className="underline" target="_blank" rel="noopener noreferrer">
            0xemir_
          </a>{" "}
          for the{" "}
          <a href="https://gensyn.ai" className="underline" target="_blank" rel="noopener noreferrer">
            Gensyn
          </a>{" "}
          community
        </p>
      </footer>
    </div>
  )
}
