import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();
http.route({
  path: "/getImage",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url);
    // This storageId param should be an Id<"_storage">
    const storageId = searchParams.get("storageId")!;
    const blob = await ctx.storage.getUrl(storageId);
    if (blob === null) {
      console.log(1);
      return new Response("Image not found", {
        status: 404,
      });
    }
    return new Response(blob);
  }),
});

export default http;