import Head from "next/head";
import {
    MantineProvider,
    AppShell,
    Navbar,
    Header,
    NavLink,
    Aside,
    Footer,
} from "@mantine/core";

// Subpage
import type { LayoutProps } from "./_layout_types";

const ThemeLayout = ({ children }: LayoutProps) => {
    return (
        <>
            <Head>
                <title>Page title</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>

            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    /** Put your mantine theme override here */
                    colorScheme: "dark",
                }}
            >
                {children}
            </MantineProvider>
        </>
    );
};

export default ThemeLayout;
