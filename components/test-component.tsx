export function TestComponent() {
  return (
    <div className="p-4 bg-background text-foreground rounded-md">
      <h2 className="text-xl font-bold mb-2">Tailwind Test Component</h2>
      <p className="text-sm text-muted-foreground">
        If you can see this with proper styling, Tailwind is working correctly!
      </p>
      <div className="mt-4 p-2 bg-primary text-primary-foreground rounded">Primary color test</div>
      <div className="mt-2 p-2 bg-secondary text-secondary-foreground rounded">Secondary color test</div>
      <div className="mt-2 p-2 bg-accent text-accent-foreground rounded">Accent color test</div>
      <div className="mt-2 p-2 bg-[#f4d8d2] text-[#260f06] rounded">Custom color test</div>
    </div>
  )
}
