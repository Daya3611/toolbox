import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  return (
    <div className="flex">
      <SignedOut>
        <Link href="/auth/sign-in">
          <Button className="rounded-lg border border-neutral-700 bg-neutral-900 px-6 py-3 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800">
            Login
          </Button>
        </Link>
      </SignedOut>

      <SignedIn>
        <Link href="/tools">
          <Button className="rounded-lg border border-neutral-700 bg-neutral-900 px-6 py-3 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800">
            Go to Dashboard
          </Button>
        </Link>
      </SignedIn>
    </div>
  );
}
