import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { api } from "@/utils/api";

import { SignedOut, SignInButton, useAuth } from "@clerk/nextjs";

export default function Home() {
  const user = useAuth();
  const router = useRouter();

  const { mutate: createUser } = api.user.create.useMutation({
    onSuccess: (response) => {
      void router.push("/playground");
      console.log("User created", response);
    },
  });

  useEffect(() => {
    if (user?.userId) {
      createUser({
        id: user.userId,
      });
    }
  }, [createUser, user?.userId]);

  return (
    <>
      <Head>
        <title>namepicker.ai</title>
        <meta name="description" content="created by aminoxix" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen w-1/2 flex-col items-center justify-center gap-6 bg-primary p-10 text-secondary">
        <h1 className="text-3xl">namepicker.ai</h1>
        <p className="text-justify">
          a web application that leverages Google&apos;s generative AI to help
          users effortlessly generate personalized usernames. by simply
          describing a few things they love, the AI will craft a unique username
          that aligns with their preferences. this application also offers
          features for generating baby names for partners and creating shortened
          versions of full names for usernames.
        </p>

        <SignedOut>
          <div className="rounded border border-secondary p-2">
            <SignInButton />
          </div>
        </SignedOut>
      </main>
    </>
  );
}
