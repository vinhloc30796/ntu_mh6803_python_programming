import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

// Mantine
import { MantineProvider } from "@mantine/core";

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Crypto Retirement - Group 10</title>
                <meta
                    name="description"
                    content="MH6803 - Python Programming"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Crypto Retirement - Group 10</h1>

                <p className={styles.description}>
                    <code className={styles.code}>MH6803</code> - Python
                    Programming
                </p>

                <div className={styles.grid}>
                    <a href="/prices" className={styles.card}>
                        <h2>Cryptocurrency Historical Price &rarr;</h2>
                        <p>Choose a coin & see its historical price!</p>
                    </a>

                    <a href="/retire" className={styles.card}>
                        <h2>Retirement Calculator! &rarr;</h2>
                        <p>Check how long it would take you to retire!</p>
                    </a>
                </div>
            </main>

            <footer className={styles.footer}>
                For Nanyang Technological University
            </footer>
        </div>
    );
};

export default Home;
