import { StreamClient, RESTClient } from "cw-sdk-node";
import { MarketBrief } from "cw-sdk-node/build/rest/types/data";
require("dotenv").config();

//? Based on the cryptowatch websocket api https://docs.cryptowat.ch/websocket-api/data-subscriptions
const rc = new RESTClient();
const streamClient = new StreamClient({
  creds: {
    // These can also be read from ~/.cw/credentials.yml
    apiKey: process.env.PK as string,
    secretKey: process.env.SK as string,
  },
  subscriptions: [
    // Subscription key for all trades from all markets
    //? 99 is ethbt in kraken, https://api.cryptowat.ch/markets
    "markets:588:trades",
  ],
});

export const connectStream = async () => {
  const markets = await rc.getMarkets();
  const marketCache: { [key: number]: MarketBrief } = {};
  markets.forEach((market) => {
    marketCache[market.id] = market; // Cache all market identifiers
  });

  // Listen for received trades and print them
  streamClient.onMarketUpdate((marketData) => {
    console.log(marketData)
    const tradesUpdate = marketData.trades;
    tradesUpdate?.forEach((tradeUpdate) => {
      console.log(
        marketCache[marketData.market.id], // access market info from cache
        tradeUpdate.side,
        "Price: ",
        tradeUpdate.price,
        "Amount: ",
        tradeUpdate.amount
      );
    });
  });

  // Connect to stream
  streamClient.connect();
};
