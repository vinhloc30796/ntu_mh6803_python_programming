import React, { useEffect, useState } from "react";

import useStyles from "./_styles";
import { Group, Card, Title, Text, Image } from "@mantine/core";

// Owned Code
import BrushChart from "./_price_chart_brush";
import { BaseCrypto, getLastPrice, dummyCrypto } from "./_price_chart_data";

export type PriceChartProps = {
    priceData: BaseCrypto[];
};

const PriceChart = (     
    { priceData }: PriceChartProps,
) => {
    const { classes, theme } = useStyles();
    const [receivedPriceData, updateReceivedPriceData] = useState(dummyCrypto);
    useEffect(() => {
        updateReceivedPriceData(priceData);
        console.log("in ../components/_price_chart.tsx: Type of priceData: ", typeof priceData, priceData);
    }, [priceData]);

    return (
        <Card withBorder p="xl" radius="md">
            <Card.Section>
                {/* <Image
                    src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                    height={320}
                    alt="Norway"
                /> */}
                <BrushChart width={640} height={320} priceData={receivedPriceData}/>
            </Card.Section>
            <Card.Section className={classes.section}>
                <Group position="apart" mt="md">
                    <Text>Closing Price</Text>
                    <Title order={3}>$ {getLastPrice(receivedPriceData)}</Title>
                </Group>
            </Card.Section>
        </Card>
    );
};

export default PriceChart;
