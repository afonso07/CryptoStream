import React, { useEffect, useState } from "react";
import styles from "../styles/Streamer.module.css";
import { wsInstance, wsDets } from "../utils/stream.utils";

const Streamer = () => {
  const [wsDets, setWsDets] = useState<wsDets>();

  if (wsInstance)
    wsInstance.onmessage = (_event) => {
      const data: wsDets = JSON.parse(_event.data.toString());
      setWsDets(data);
    };

  console.log("render");
  return (
    <div className={styles.container}>
      <div>
        <span className={styles.underscore}>_</span>CryptoStream
      </div>
      <div>hello</div>
    </div>
  );
};

export default Streamer;
