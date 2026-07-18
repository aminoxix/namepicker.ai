import { env } from "@/env";
import { schemindFetch } from "@/server/schemind";

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
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(input.id);

      const response = await schemindFetch(
        `${env.BACKEND_ENDPOINT_URL}/user/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user.id,
            username: user.username,
            email: user.emailAddresses[0]?.emailAddress,
          }),
        },
      );
      const data = response.json();
      return data;
    }),
});
