import "dotenv/config";
import { run, HandlerContext } from "./index.js";

run(async (context: HandlerContext) => {
  // Get the message and the address from the sender
  const { content, senderAddress } = context.message;

  // To reply, just call `reply` on the HandlerContext.
  await context.reply(`ECHO: ${content}`);
});