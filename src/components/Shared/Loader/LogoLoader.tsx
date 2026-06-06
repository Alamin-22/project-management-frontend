"use client";

import Image from "next/image";

const LogoLoader = () => {
  const keyframes = `
    @keyframes pulse-custom {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;

  return (
    <>
      <style jsx global>{`
        ${keyframes}
        .animate-pulse-custom {
          animation: pulse-custom 2s ease-in-out infinite;
        }
      `}</style>

      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background font-sans">
        <div className="animate-pulse-custom">
          <Image
            src="/Assets/logo/logo.png"
            width={256}
            height={256}
            className="h-auto w-auto max-w-37.5 sm:max-w-[256px]"
            alt="SmartProject Logo"
            priority={true}
            quality={90}
          />
        </div>
      </div>
    </>
  );
};

export default LogoLoader;
