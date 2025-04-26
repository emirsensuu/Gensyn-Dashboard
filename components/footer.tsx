export function Footer() {
  return (
    <footer className="mt-8 sm:mt-16">
      <div className="dotted-divider my-4 sm:my-6"></div>

      <div className="bg-[#9a7f78]/40 p-4 sm:p-6 rounded-md text-center mb-4 sm:mb-6">
        <p className="text-xs sm:text-sm">
          This is not an official Gensyn tool. This dashboard is an unofficial community project.
        </p>
      </div>

      <div className="text-center text-xs sm:text-sm">
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
      </div>
    </footer>
  )
}
