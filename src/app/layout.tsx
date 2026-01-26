import "./globals.css";
import { Poppins } from "next/font/google";
import { Providers } from "../components/Providers";
import NextTopLoader from "nextjs-toploader";
const poppins = Poppins({ weight: "400", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="min-h-screen w-full">
      <body className={`${poppins.className} text-stone-900 dark:bg-black dark:text-white`}>
        <Providers>
          <NextTopLoader
            color="#5C38CC"
            height={2}
            showSpinner={false}
            crawl={true}
            speed={200}
            easing="ease"
          />

          {children}
        </Providers>
      </body>
    </html>
  );
}
