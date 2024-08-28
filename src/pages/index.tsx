import Head from "next/head";
import { useRouter } from "next/router";

import { useEffect } from "react";

import { SignedOut, SignInButton, useAuth } from "@clerk/nextjs";

import { Loading3QuartersOutlined } from "@ant-design/icons";

export default function Home() {
  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user.isSignedIn) {
      void router.push("playground");
    }
  }, [router, user]);

  return (
    <>
      <Head>
        <title>namepicker.ai</title>
        <meta name="description" content="created by aminoxix" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen w-auto flex-col items-center justify-center gap-6 bg-primary px-5 py-8 text-secondary md:w-1/2">
        <h1 className="text-3xl">namepicker.ai</h1>
        <p className="text-justify">
          a web application that leverages Google&apos;s generative AI to help
          users effortlessly generate personalized usernames. by simply
          describing a few things they love, the AI will craft a unique username
          that aligns with their preferences. this application also offers
          features for generating baby names for partners and creating shortened
          versions of full names for usernames.
        </p>

        {user.isLoaded || <Loading3QuartersOutlined className="animate-spin" />}
        <SignedOut>
          <div className="rounded border border-secondary p-2 hover:bg-secondary hover:text-primary">
            <SignInButton />
          </div>
        </SignedOut>
      </main>
    </>
  );
}
