import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Streamer from "../components/Streamer";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Streamer />
    </div>
  );
};

export default Home;
