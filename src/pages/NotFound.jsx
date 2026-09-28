import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-sm font-semibold text-indigo-500">404</p>
        <h1 className="mt-2 page-title">Page not found</h1>
        <p className="mt-3 body-copy">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link to="/" className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-base font-semibold text-white">
          Go home
        </Link>
      </div>
    </div>
  );
}
