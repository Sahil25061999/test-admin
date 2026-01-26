import { Lock } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <Lock className="h-10 w-10 text-primary" />
        <h1 className="text-xl font-semibold text-primary">
          Unauthorized
        </h1>
      </div>
    </div>
  );
}
