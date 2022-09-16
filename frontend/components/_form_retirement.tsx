import { useState } from "react";
import { useForm,  } from "@mantine/form";
import { DateRangePicker } from "@mantine/dates";
import { NumberInput, Grid, Button } from "@mantine/core";
// Data
import { init_starting_asset, init_retirement_goal } from "./_consts";
import { dummyCrypto, BaseCrypto, getPrice, getDate, extractPrices } from "./_price_chart_data";
import { extractRetirementYears } from "./_retirement_data";

export type RetirementFormProps = {
    appShellCoin: string,
    appShellDateRange: [Date | null, Date | null],
    setYearsToRetire: React.Dispatch<React.SetStateAction<number>>,
};

const RetirementForm = (
    {
        appShellCoin,
        appShellDateRange,
        setYearsToRetire,
    }: RetirementFormProps
) => {
    // Handle submission
    const onFormSubmit = (
        coin: string,
        date_range: [Date | null, Date | null],
        starting_asset: number,
        retirement_goal: number,
    ) => {
        // Set starting asset and retirement goal
        console.log("Retirement form submitted!")
        console.log("starting_asset", starting_asset, );
        console.log("retirement_goal", retirement_goal, );
        console.log("coin", coin, );
        console.log("date_range", date_range, );
        // Get new years to retire
        const newYearsToRetire: Promise<number> = extractRetirementYears(
            coin,
            date_range[0],
            date_range[1],
            starting_asset,
            retirement_goal,
        )
        // Convert Promise<> to number[]
        newYearsToRetire.then((yearsToRetire) => {
            setYearsToRetire(yearsToRetire);
        });

    };


    // Init form
    const retirement_form = useForm({
        initialValues: {
            starting_asset: init_starting_asset,
            retirement_goal: init_retirement_goal,
        },
    });

    return (
        <form onSubmit={retirement_form.onSubmit(
            (values) => onFormSubmit(
                appShellCoin,
                appShellDateRange,
                values.starting_asset,
                values.retirement_goal,
            )
        )}>
            <Grid align="flex-end">
                <Grid.Col span={5}>
                    <NumberInput
                        label="Starting Asset"
                        defaultValue={init_starting_asset}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={(value) =>
                            !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : '$ '
                        }
                        {...retirement_form.getInputProps("starting_asset")}
                        />
                </Grid.Col>
                <Grid.Col span={5}>
                    <NumberInput
                        label="Retirement Goal"
                        defaultValue={init_retirement_goal}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={(value) =>
                            !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : '$ '
                        }
                        {...retirement_form.getInputProps("retirement_goal")}
                    />
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

export default RetirementForm;
