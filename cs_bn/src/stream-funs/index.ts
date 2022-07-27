import { StreamClient, RESTClient } from "cw-sdk-node";
import { MarketBrief } from "cw-sdk-node/build/rest/types/data";
import { Request } from "express";
import WebSocket from "ws";
import queryString from "query-string";

require("dotenv").config();

export const connectStream = async () => {
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
  const markets = await rc.getMarkets();
  const marketCache: { [key: number]: MarketBrief } = {};
  markets.forEach((market) => {
    marketCache[market.id] = market; // Cache all market identifiers
  });

  // Listen for received trades and print them
  streamClient.onMarketUpdate((marketData) => {
    console.log(marketData);
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

//? Server based on the following: https://cheatcode.co/tutorials/how-to-set-up-a-websocket-server-with-node-js-and-express
export const initWServer = (_expresserver: any) => {
  const wsServer = new WebSocket.Server({
    noServer: true, //? detatch from the HTTP server
    path: "/cryptostream",
  });

  /*
Passed to the callback for the event handler—the .on('upgrade') part—we have three arguments request, 
socket, and head. request represents the inbound HTTP request that was made from a websocket client, 
socket represents the network connection between the browser (client) and the server, and head represents 
the first packet/chunk of data for the inbound request.
https://cheatcode.co/tutorials/how-to-set-up-a-websocket-server-with-node-js-and-express#:~:text=Passed%20to%20the%20callback,for%20the%20inbound%20request.
  */
  _expresserver.on("upgrade", (request: Request, socket: any, head: any) => {
    /*
What we're saying with this is "we're being asked to upgrade this HTTP request to a websocket request,
 so perform the upgrade and then return the upgraded connection to us."

 ith that upgraded connection, we need to handle the connection—to be clear, this is the now-connected 
 websocket client connection. To do it, we "hand off" the upgraded connection websocket and the original 
 request by emitting an event on the websocketServer with the name connection.
 https://cheatcode.co/tutorials/how-to-set-up-a-websocket-server-with-node-js-and-express#:~:text=What%20we%27re%20saying%20with%20this%20is%20%22we%27re%20being%20asked%20to%20upgrade%20this%20HTTP%20request%20to%20a%20websocket%20request%2C%20so%20perform%20the%20upgrade%20and%20then%20return%20the%20upgraded%20connection%20to%20us.%22
    */
    wsServer.handleUpgrade(request, socket, head, (websocket) => {
      wsServer.emit("connection", websocket, request);
      console.log("Websocket connection established");
    });
  });

  return wsServer;
};

export const wsConsumer = (
  _wsServer: WebSocket.Server<WebSocket.WebSocket>
) => {
  _wsServer.on("connection", (wsConnection, connectionReq) => {
    //? wsConnection -> the open connection that is happening between the server and client
    //? connectionReq -> the original request that opened the connection
    const [_, params] = connectionReq?.url?.split("?") || [];
    const connParams = queryString.parse(params);

    console.log("Params: ", connParams.name);

    wsConnection.on("message", (message) => {
      console.log(message);
      const parseMessage = JSON.parse(message.toString());
      console.log("Message", parseMessage);
      wsConnection.send(JSON.stringify({ message: "Hello! Im CryptoStream!" }));
    });
  });
};
