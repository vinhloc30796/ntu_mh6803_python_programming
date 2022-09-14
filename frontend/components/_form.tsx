import { useState } from "react";
import { useForm,  } from "@mantine/form";
import { DateRangePicker } from "@mantine/dates";
import { TextInput, Grid, Button } from "@mantine/core";
// Data
import { dummyCrypto, BaseCrypto, getPrice, getDate, extractPrices } from "./_price_chart_data";

export type CryptoFormProps = {
    setFilteredStock: React.Dispatch<React.SetStateAction<BaseCrypto[]>>;
};

const CryptoForm = (
    { setFilteredStock }: CryptoFormProps
) => {
    const init_start_date = new Date(2021, 8, 1)
    const init_end_date = new Date(2021, 11, 1)
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        init_start_date,
        init_end_date
    ]);
    const onFormSubmit = (coin: string, dateRange: [Date | null, Date | null]) => {
        // Pull new stock data from API using extractPrices
        const newStock: Promise<BaseCrypto[]> = extractPrices(coin, dateRange[0], dateRange[1]);
        // Convert Promise<> to BaseCrypto[]
        newStock.then((stock) => {
            setFilteredStock(stock);
        });
        // trigger re-render
        
    };

    const form = useForm({
        initialValues: {
            coin: "bitcoin",
            start_date: init_start_date,
            end_date: init_end_date,
        },
    });

    return (
        <Grid align="flex-end">
            <form onSubmit={form.onSubmit(
                (values) => onFormSubmit(values.coin, dateRange)
            )}>
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
            </form>
        </Grid>
    );
};

export default CryptoForm;
