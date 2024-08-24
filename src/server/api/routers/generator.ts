import { env } from "@/env";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const generatorRouter = createTRPCRouter({
  getAllFavNames: protectedProcedure.query(async () => {
    const response = await fetch(
      `${env.BACKEND_ENDPOINT_URL}/prompt/favorites`,
    );
    const data = response.json();
    return data;
  }),

  generateFavName: protectedProcedure
    .input(
      z.object({
        aim: z.string(),
        name: z.string(),
        hobby: z.string(),
        animal: z.string(),
        background: z.string(),
        worded: z.enum(["ONE", "TWO"]),
        userId: z.string(),
        isFav: z.boolean(),
        isCombo: z.boolean(),
        isUsername: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await fetch(
        `${env.BACKEND_ENDPOINT_URL}/prompt/favorites/create`,
        {
          method: "POST",
          body: JSON.stringify(input),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = response.json();
      return data;
    }),

  generateComboName: protectedProcedure
    .input(
      z.object({
        partner1: z.string(),
        partner2: z.string(),
        gender: z.enum(["GIRL", "BOY"]),
        userId: z.string(),
        isFav: z.boolean(),
        isCombo: z.boolean(),
        isUsername: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await fetch(
        `${env.BACKEND_ENDPOINT_URL}/prompt/combos/create`,
        {
          method: "POST",
          body: JSON.stringify(input),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = response.json();
      return data;
    }),
  generateUsername: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        worded: z.enum(["ONE", "TWO"]),
        userId: z.string(),
        isFav: z.boolean(),
        isCombo: z.boolean(),
        isUsername: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await fetch(
        `${env.BACKEND_ENDPOINT_URL}/prompt/usernames/create`,
        {
          method: "POST",
          body: JSON.stringify(input),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = response.json();
      return data;
    }),
});
