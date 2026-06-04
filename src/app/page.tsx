"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="text-5xl text-center my-40 text-red-500">Redirecting..</div>
  );
};

export default HomePage;
