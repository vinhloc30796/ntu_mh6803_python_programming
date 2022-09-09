import { Group, Card, Title, Text, Image, createStyles } from "@mantine/core";
import useStyles from "./_styles";
import BrushChart from "./_price_chart_brush";

const PriceChart = () => {
    const { classes, theme } = useStyles();

    return (
        <Card withBorder p="xl" radius="md">
            <Card.Section>
                {/* <Image
                    src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                    height={320}
                    alt="Norway"
                /> */}
                <BrushChart width={640} height={320}/>
            </Card.Section>
            <Card.Section className={classes.section}>
                <Group position="apart" mt="md">
                    <Text>Closing Price</Text>
                    <Title order={3}>$ 30,000</Title>
                </Group>
            </Card.Section>
        </Card>
    );
};

export default PriceChart;
