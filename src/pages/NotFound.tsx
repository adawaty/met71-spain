import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center p-8">
      <div className="max-w-lg text-center space-y-4">
        <div className="font-display text-5xl">404</div>
        <p className="text-muted-foreground">Page not found.</p>
        <Link href="/">
          <Button className="rounded-full">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
