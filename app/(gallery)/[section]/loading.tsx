export default function Loading() {
  return (
    <div role="status" className="space-y-6 p-4 md:p-6">
      <span className="sr-only">Loading gallery</span>
      <div className="h-24 max-w-xl rounded-lg bg-muted" />
      <div className="h-14 rounded-lg bg-muted" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => <div key={index} className="aspect-[3/4] rounded-2xl bg-muted" />)}
      </div>
    </div>
  );
}
