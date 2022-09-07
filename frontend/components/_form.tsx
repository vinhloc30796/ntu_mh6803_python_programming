import { useState } from 'react';
import { useForm } from '@mantine/form';
import { DateRangePicker } from '@mantine/dates';
import { TextInput, Grid, Button, Group } from '@mantine/core';

const CryptoRange = () => {
    const [value, setValue] = useState<[Date | null, Date | null]>([
        new Date(2021, 8, 1),
        new Date(2021, 11, 1),
    ]);

    return <DateRangePicker 
        label="Time Range"
        value={value} 
        onChange={setValue} 
    />;
}


const CryptoForm = () => {
    const form = useForm({
        initialValues: {
            coin: '',
            start_date: '',
            end_date: '',
        },
    });

    return (
        <Grid align="flex-end">
            <Grid.Col span={5}>
                <TextInput label="Coin" placeholder="e.g. bitcoin, ethereum" {...form.getInputProps('coin')} />
            </Grid.Col>
            <Grid.Col span={5}>
                <CryptoRange/>
            </Grid.Col>
            <Grid.Col span={2}>
                <Button
                    variant="outline"
                    onClick={() =>
                    form.setValues({
                        // Get coin from TextInput
                        coin: "SUBMITTED",
                        // Get start_date from RangeCalendar
                        start_date: "SUBMITTED",
                        end_date: "SUBMITTED",
                    })}
                >
                Submit
                </Button>
            </Grid.Col>
        </Grid>            
    );
}

export default CryptoForm