export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 md:grid-cols-3">
        {["Revenue", "Users", "Retention"].map((title) => (
          <article
            key={title}
            className="rounded-xl border border-border bg-card p-5 shadow-xs"
          >
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="mt-4 h-7 w-24 rounded-md bg-muted" />
            <div className="mt-3 h-4 w-32 rounded-md bg-muted/70" />
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <article className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-foreground">Overview</h2>
              <p className="text-sm text-muted-foreground">Weekly performance snapshot</p>
            </div>
          </div>
          <div className="mt-6 h-72 rounded-xl bg-muted" />
        </article>

        <article className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <h2 className="text-sm font-medium text-foreground">Recent activity</h2>
          <div className="mt-4 flex flex-col gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3"
              >
                <div className="size-8 rounded-full bg-muted" />
                <div className="flex-1">
                  <div className="h-4 w-32 rounded-md bg-muted" />
                  <div className="mt-2 h-3 w-40 rounded-md bg-muted/70" />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
