import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-extrabold tracking-tight text-primary">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Page not found
          </h2>
          <p className="max-w-[600px] text-muted-foreground mx-auto">
            Sorry, we couldn't find the page you're looking for. The links might
            be broken or the page may have been removed.
          </p>
        </div>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-primary/90 hover:bg-primary/90"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
