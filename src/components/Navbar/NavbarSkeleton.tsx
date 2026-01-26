
export function NavbarSkeleton() {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r animate-pulse">
      <div className="h-full flex flex-col">

        <div className="flex items-center gap-3 px-4 py-5 border-b">
          <div className="w-10 h-10 rounded bg-gray-200" />
          <div className="h-5 w-32 bg-gray-200 rounded" />
        </div>


        <nav className="flex-1 px-3 py-4 space-y-3">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-full bg-gray-200 rounded-md"
            />
          ))}
        </nav>

      </div>
    </aside>
  );
}
