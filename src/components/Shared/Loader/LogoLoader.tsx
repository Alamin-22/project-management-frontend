import Image from "next/image";

const IMSLoader = () => {
  const keyframes = `
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
  `;

  const logoStyle = {
    animation: "pulse 2s ease-in-out infinite",
  };

  return (
    <>
      <style>{keyframes}</style>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white font-sans">
        <div style={logoStyle}>
          <Image
            src={"/Assets/logo/IMS-Logo.png"}
            width={256}
            height={256}
            style={{ height: "auto", width: "auto" }}
            alt="Bring By Air Logo"
            priority={true}
            quality={90}
          />
        </div>
      </div>
    </>
  );
};

export default IMSLoader;
