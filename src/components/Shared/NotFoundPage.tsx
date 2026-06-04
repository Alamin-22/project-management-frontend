import Image from "next/image";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className=" min-h-screen flex items-center">
      <div className="container mx-auto md:mx-10 xl:mx-auto py-20 px-4 md:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-20 items-center">
          <Image
            src={"/Assets/notfound.svg"}
            alt="Something went wrong"
            width={500}
            height={500}
            className="block sm:hidden w-full h-auto"
            priority
          />

          <div>
            <h1
              className={`font-semibold text-red-600 text-3xl md:text-4xl mb-4 `}
            >
              Something is not right...
            </h1>
            <p className="text-gray-600 text-lg">
              The page you&apos;re trying to open doesn&apos;t exist. You might
              have mistyped the address, or the page has been moved to another
              URL. If you think this is an error, please contact support.
            </p>

            <Link href="/" passHref>
              <button className="mt-8 btn btn-outline btn-md lg:btn-lg">
                Get back to home page
              </button>
            </Link>
          </div>

          <Image
            src={"/Assets/notfound.svg"}
            alt="Something went wrong"
            width={500}
            height={500}
            className="hidden sm:block w-full h-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
