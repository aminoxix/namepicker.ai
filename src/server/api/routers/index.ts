import { createTRPCRouter, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure.query(({ ctx }) => {
    return {
      greeting: `hello! ${ctx.auth?.userId}`,
    };
  }),
});
