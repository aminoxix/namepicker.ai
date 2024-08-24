import { env } from "@/env";

import { clerkClient } from "@clerk/nextjs/server";

import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await clerkClient().users.getUser(input?.id);

      const response = await fetch(`${env.BACKEND_ENDPOINT_URL}/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.emailAddresses[0]?.emailAddress,
        }),
      });
      const data = response.json();
      return data;
    }),
});
