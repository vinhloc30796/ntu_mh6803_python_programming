import Head from "next/head";
import type { ReactElement } from "react";
import { Card, Space, Title, Text } from "@mantine/core";

// Layouts
import type { NextPageWithLayout } from "../components/_layout_types";
import ThemeLayout from "../components/_theme";
import AppshellLayout from "../components/_appshell";

// Components
import CryptoForm from "../components/_form";
import PriceChart from "../components/_price_chart";

// Styles
import useStyles from "../components/_styles";

const Retire: NextPageWithLayout = () => {
    const { classes, theme } = useStyles();

    return (
        <>
            <Head>
                <title>Retire</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <Card withBorder p="xl" radius="md">
                <Card.Section className={classes.section}>
                    <Title order={2} mt="md" mb="md">
                        Retire Params
                    </Title>
                    <CryptoForm />
                </Card.Section>
                <Card.Section className={classes.section}>
                    <Text mt="md">
                        At this rate, you'll retire in 10 years.
                    </Text>
                </Card.Section>
            </Card>
        </>
    );
};

Retire.getLayout = function getLayout(page: ReactElement) {
    return (
        <ThemeLayout>
            <AppshellLayout>{page}</AppshellLayout>
        </ThemeLayout>
    );
};

export default Retire;
