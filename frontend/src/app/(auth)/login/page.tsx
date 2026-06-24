export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <section className="w-full max-w-sm rounded-lg border border-border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-ink">Login</h1>
        <form className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-ink">
            Username
            <input className="mt-2 h-10 w-full rounded-md border border-border px-3" name="username" />
          </label>
          <label className="block text-sm font-medium text-ink">
            Password
            <input className="mt-2 h-10 w-full rounded-md border border-border px-3" name="password" type="password" />
          </label>
          <button className="h-10 w-full rounded-md bg-brand px-4 text-sm font-medium text-white" type="submit">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
