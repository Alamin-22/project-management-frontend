import TokenFromUrl from "@/Provider/TokenFromUrl";
import { PropsWithChildren, Suspense } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="">
      <Suspense fallback={null}>
        <TokenFromUrl />
      </Suspense>

      <main>{children}</main>
    </div>
  );
}
