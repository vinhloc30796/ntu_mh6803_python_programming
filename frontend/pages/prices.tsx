import Head from "next/head";
import type { ReactElement } from "react";
// Layouts
import type { NextPageWithLayout } from "../components/_layout_types";
import ThemeLayout from "../components/_theme";
import AppshellLayout from "../components/_appshell";

const Prices: NextPageWithLayout = () => {
    return (
        <>
            <Head>
                <title>Prices</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <h1>Prices</h1>
        </>
    );
};

Prices.getLayout = function getLayout(page: ReactElement) {
    return (
        <ThemeLayout>
            <AppshellLayout>{page}</AppshellLayout>
        </ThemeLayout>
    );
};

export default Prices;
