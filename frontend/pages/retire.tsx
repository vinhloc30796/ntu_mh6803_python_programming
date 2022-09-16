// NextJS
import Head from "next/head";
import { useRouter } from "next/router";
import { InferGetStaticPropsType } from "next";
// ReactJS
import React, { useState } from "react";
// Mantine
import { 
    Card, 
    Space, 
    Title, 
    Text, 
    AppShell,
    Header,
    Grid,
    Navbar,
} from "@mantine/core";

// Layouts
import type { NextPageWithLayout } from "../components/_layout_types";
import CustomNavBar from "../components/_custom_navbar";

// Components
import CryptoForm from "../components/_form_prices";
import PriceChart from "../components/_price_chart";
import RetirementForm from "../components/_form_retirement";

// Styles
import useStyles from "../components/_styles";

// Data
import { dummyCryptoPromise, dummyMetricsPromise } from "../components/_price_chart_data";
import { dummyYears } from "../components/_retirement_data";
import { init_coin, init_start_date, init_end_date } from "../components/_consts";

const Retire: NextPageWithLayout = (
    {initPrices, initMetrics, initYearsToRetire} : InferGetStaticPropsType<typeof getStaticProps>
) => {

    const { classes, theme } = useStyles();
    // Get coin & date range from AppShell
    const router = useRouter();
    const [coin, setCoin] = useState<string>(init_coin);
    const [dateRange, setDateRange] = useState<[Date, Date]>([init_start_date, init_end_date]);
    const [priceData, updatePriceData] = useState(initPrices);
    const [yearsToRetire, updateYearsToRetire] = useState(initYearsToRetire);
    const [metrics, updateMetrics] = useState(initMetrics);
    
    console.log("in ../pages/retire.tsx: Type of yearsToRetire: ", typeof yearsToRetire, yearsToRetire);
    console.log("in ../pages/retire.tsx: Type of metrics: ", typeof metrics, metrics);

    return (
        <AppShell
            padding="md"
            fixed={false}
            navbar={<CustomNavBar router={router} />}
            header={
                <Header height="100" px="20" p="xs">
                    <Grid align="center">
                        <Grid.Col span={3}>
                            <Title order={1} ml="md">
                                Group 10
                            </Title>
                        </Grid.Col>
                        <Grid.Col span={9}>
                            <CryptoForm 
                                setAppShellCoin={setCoin} 
                                setAppShellDateRange={setDateRange} 
                                setAppShellFilteredStock={updatePriceData}
                                setAppShellMetrics={updateMetrics}
                            />
                        </Grid.Col>
                    </Grid>
                </Header>
            }
            styles={(theme) => ({
                main: {
                    backgroundColor:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.gray[0],
                },
            })}
        >   
            {/* Rerender PriceChart on priceData updates */}
            <PriceChart priceData={priceData} metrics={metrics}/>
            <Space h="md" />
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
                    {/* Take in coin & dateRange from AppShell
                    to pass into RetirementForm */}
                    <RetirementForm 
                        appShellCoin={coin}
                        appShellDateRange={dateRange}
                        setYearsToRetire={updateYearsToRetire}
                    />
                </Card.Section>
                <Card.Section className={classes.section}>
                    <Text>
                        "{coin}" prices 
                        from {dateRange[0].toISOString().split("T")[0] + " "}
                        to {dateRange[1].toISOString().split("T")[0]}
                    </Text>
                    <Text mt="md">
                        {/* Format in two decimals */}
                        At this rate, {( 
                            yearsToRetire<0 ? "you will never retire!" : "you will retire in " + yearsToRetire.toFixed(2) + " years"
                        )}   
                    </Text>
                </Card.Section>
            </Card>
        
        </AppShell>
    );
};

// Static props
export const getStaticProps = async () => {
    const initPrices = await dummyCryptoPromise;
    const initMetrics = await dummyMetricsPromise;
    const initYearsToRetire = await dummyYears;
    const props = {
        initPrices,
        initMetrics,
        initYearsToRetire,
    };
    return {
        props
    };
};

export default Retire;
