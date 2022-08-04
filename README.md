# 💸 CryptoStream

> 💸 CryptoStream is a simple way to stream any crypto asset/exchange/instrument using the CryptoWatch API.
---
## 🏃‍♂️ Running CryptoStream
First give permissions to the script to be run by executing `chmod +x StreamRun`. After, you can run both the back and front-ends by simply executing the `StreamRun` script.

![[video-to-gif output image]](https://im3.ezgif.com/tmp/ezgif-3-431a68921d.gif)

### Changing Stream Data
The data being streamed can be changed by altering the `subscriptions` array within the `cs_bn/src/stream-funs/index.ts` TypeScript file. For further information on how to configure the different subscriptions visit the [CryptoWatch Web-socket documentation](https://docs.cryptowat.ch/websocket-api/data-subscriptions/trades).

