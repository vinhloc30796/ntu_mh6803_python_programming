// React
import React, { useEffect, useState } from "react";
// Mantine
import useStyles from "./_styles";
import { Group, Card, Title, Text, Image } from "@mantine/core";

// Owned Code
import { 
    init_coin,
    init_start_date,
    init_end_date,
} from "./_consts";
import BrushChart from "./_price_chart_brush";
import { BaseCrypto, getLastPrice } from "./_price_chart_data";

export type PriceChartProps = { 
    priceData: BaseCrypto[]; 
    metrics: Object;
};

const PriceChart = (     
    { priceData, metrics }: PriceChartProps,
) => {

    const { classes, theme } = useStyles();
    const [receivedPriceData, updateReceivedPriceData] = useState(priceData);
    useEffect(() => {
        updateReceivedPriceData(priceData);
        // console.log("in ../components/_price_chart.tsx: Type of priceData: ", typeof priceData, priceData);
    }, [priceData]);

    return (
        <Card withBorder p="xl" radius="md">
            <Card.Section>
                {/* <Image
                    src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                    height={320}
                    alt="Norway"
                /> */}
                <BrushChart width={960} height={480} priceData={receivedPriceData}/>
            </Card.Section>
            <Card.Section className={classes.section}>
                <Title order={2}>Metrics</Title>
                {
                    // Map metrics to Text
                    Object.keys(metrics).map((key) => {
                        // If key contain "Price" then format in dollars
                        if (key.includes("Price")) {
                            return (
                                // <Group position="apart" mt="md">
                                //     <Text key={key}>{key}</Text>
                                //     <Title order={3}>
                                //         ${metrics[key].toFixed(2)}
                                //     </Title>    
                                // </Group>
                                // returns nothing
                                <></>
                            )
                        } else {
                            return (
                                <Group position="apart" mt="md">
                                    <Text>{key}</Text> 
                                    <Title order={4}>{metrics[key].toFixed(4)}</Title>
                                </Group>
                            );
                        }
                    })
                }
            </Card.Section>
        </Card>
    );
};


export default PriceChart;
