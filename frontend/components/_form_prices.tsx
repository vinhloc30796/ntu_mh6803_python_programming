import { useState } from "react";
import { useForm,  } from "@mantine/form";
import { DateRangePicker } from "@mantine/dates";
import { TextInput, Grid, Button } from "@mantine/core";
// Data
import { init_start_date, init_end_date, } from "./_consts";
import { BaseCrypto, Metrics, extractPrices, extractMetrics } from "./_price_chart_data";

export type CryptoFormProps = {
    setAppShellCoin: React.Dispatch<React.SetStateAction<string>>;
    setAppShellDateRange: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>;
    setAppShellFilteredStock: React.Dispatch<React.SetStateAction<BaseCrypto[]>>;
    setAppShellMetrics: React.Dispatch<React.SetStateAction<Object>>;
    // Optional, default to None
    // setStartingAsset: React.Dispatch<React.SetStateAction<number>>;
    // setRetirementGoal: React.Dispatch<React.SetStateAction<number>>;
};

const CryptoForm = (
    {
        setAppShellCoin,
        setAppShellDateRange,
        setAppShellFilteredStock,
        setAppShellMetrics
    }: CryptoFormProps
) => {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        init_start_date,
        init_end_date
    ]);
    const onFormSubmit = (
        coin: string, 
        dateRange: [Date | null, Date | null]
    ) => {
        // Set coin and date range
        console.log("Crypto form submitted!")
        console.log("coin", coin, );
        console.log("dateRange", dateRange, );
        // Set app shell
        setAppShellCoin(coin);
        setAppShellDateRange(dateRange);
        
        // Pull new stock data from API using extractPrices
        const newStock: Promise<BaseCrypto[]> = extractPrices(coin, dateRange[0], dateRange[1]);
        newStock.then((stock) => {
            setAppShellFilteredStock(stock);
        });

        // Pull new metrics from API using extractMetrics
        const newMetrics: Promise<Object> = extractMetrics(coin, dateRange[0], dateRange[1]);
        newMetrics.then((metrics) => {
            setAppShellMetrics(metrics);
        });
    };

    const form = useForm({
        initialValues: {
            coin: "bitcoin",
            start_date: init_start_date,
            end_date: init_end_date,
        },
    });

    return (
        <form onSubmit={form.onSubmit(
            (values) => onFormSubmit(values.coin, dateRange)
        )}>
            <Grid align="flex-end">
                <Grid.Col span={3}>
                    <TextInput
                        label="Coin"
                        placeholder="e.g. bitcoin, ethereum"
                        {...form.getInputProps("coin")}
                    />
                </Grid.Col>
                <Grid.Col span={7}>
                    <DateRangePicker label="Time Range" value={dateRange} onChange={setDateRange} />
                </Grid.Col>
                <Grid.Col span={2}>
                    <Button
                        variant="outline"
                        type="submit"
                    >
                        Submit
                    </Button>
                </Grid.Col>
            </Grid>
        </form>
    );
};

export default CryptoForm;
