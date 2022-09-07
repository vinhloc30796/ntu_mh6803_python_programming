import Head from "next/head";
import { MantineProvider } from "@mantine/core";

// Layouts
import type { AppPropsWithLayout } from "../components/_layout_props_types";
import ThemeLayout from "../components/_theme";

export default function App(props: AppPropsWithLayout) {
    const { Component, pageProps } = props;
    const getLayout = Component.getLayout ?? ((page) => page);

    return getLayout(
        <ThemeLayout>
            <Component {...pageProps} />
        </ThemeLayout>
    );
}
