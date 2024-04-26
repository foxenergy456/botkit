# Conversational Bot

Simple echo bot

## Usage

This is a simple yet powerful conversational framework that will allow you to customize it to your needs.

```tsx
const cacheStep = inMemoryCacheStep.get(senderAddress) || 0;

let message = "";
if (cacheStep === 0) {
  message = "Welcome! Choose an option:\n1. Info\n2. Subscribe";
  // Move to the next step
  inMemoryCacheStep.set(senderAddress, cacheStep + 1);
} else if (cacheStep === 1) {
  if (content === "1") {
    message = "Here is the info.";
    //reset the bot to the initial step
    inMemoryCacheStep.set(senderAddress, 0);
  } else if (content === "2") {
    await redisClient.set(senderAddress, "subscribed");
    message =
      "You are now subscribed. You will receive updates.\n\ntype 'stop' to unsubscribe";
    //reset the bot to the initial step
    inMemoryCacheStep.set(senderAddress, 0);
  } else {
    message = "Invalid option. Please choose 1 for Info or 2 to Subscribe.";
    // Keep the same step to allow for re-entry
  }
} else {
  message = "Invalid option. Please start again.";
  inMemoryCacheStep.set(senderAddress, 0);
}

//Send the message
await context.reply(message);
```

#### Cron for daily subscriptions

Create a cron that sends daily messages to your **redis database** subscribers. This bot can run daily or according to your logic.

```jsx
cron.schedule(
  "0 0 * * *", //Daily
  async () => {
    const redisClient = await getRedisClient();
    const keys = await redisClient.keys("*");
    console.log(`Running daily task. ${keys.length} subscribers.`);
    for (const address of keys) {
      const subscriptionStatus = await redisClient.get(address);
      if (subscriptionStatus === "subscribed") {
        console.log(`Sending daily update to ${address}`);
        const client = await xmtpClient();
        const conversation = await client?.conversations.newConversation(
          address
        );
        await conversation.send("Here is your daily update!");
      }
    }
  },
  {
    scheduled: true,
    timezone: "UTC",
  }
);
```

## Running the bot

> ⚠️ Bot kit is not compatible with `bun`. Use `npm` or `yarn`

```bash
# install dependencies
yarn install

# running the bot
yarn build
yarn start

# to run with hot-reload
yarn build:watch
yarn start:watch
```

## Variables

```bash
KEY= # the private key of the bot
XMTP_ENV= # set to production
REDIS_CONNECTION_STRING= # the connection string for the Redis database
```