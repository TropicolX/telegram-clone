import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="sm:w-svw sm:h-svh py-4 bg-background w-full h-full flex items-center justify-center">
      <SignUp />
    </div>
  );
}
