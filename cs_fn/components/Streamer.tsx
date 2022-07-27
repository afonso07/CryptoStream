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

  return (
    <div className={styles.container}>
      <div>
        <span className={styles.underscore}>_</span>CryptoStream
      </div>
      <div className={styles.stream_dets}>
        {Object.keys(wsDets || {}).map((val: string, index) => (
          <div key={index}>
            <span style={{color:'yellow'}}>{val.charAt(0).toUpperCase() + val.slice(1)}:</span>
            {wsDets ? wsDets[val] : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Streamer;
