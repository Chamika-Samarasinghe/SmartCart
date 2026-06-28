import SignInForm from "./SignInForm";

export default function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const callbackUrl = searchParams.callbackUrl ?? "/products";

  return (
    <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-indigo-600 tracking-tight">
            Smart<span className="text-gray-900">Cart</span>
          </span>
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Sign in to your account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Use your Google or Facebook account to continue
          </p>
        </div>

        <SignInForm callbackUrl={callbackUrl} />

        <p className="mt-8 text-center text-xs text-gray-400">
          By signing in you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
