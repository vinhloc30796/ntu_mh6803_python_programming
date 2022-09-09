import Link from "next/link";
import { useRouter } from "next/router";
import {
    AppShell,
    Navbar,
    Header,
    NavLink,
    Title,
    Grid,
    Space,
} from "@mantine/core";

// Subpage
import CryptoForm from "./_form";
import PriceChart from "./_price_chart";
import type { LayoutProps } from "./_layout_types";

const NavBar = (router) => {
    return (
        <Navbar width={{ base: "25%" }} p="xs">
            <Navbar.Section grow mt="md">
                <Link href="/prices" passHref>
                    <NavLink
                        component="a"
                        label="Prices"
                        active={router.pathname === "/prices"}
                    />
                </Link>
                <Link href="/retire" passHref>
                    <NavLink
                        component="a"
                        label="Retire"
                        active={router.pathname === "/retire"}
                    />
                </Link>
            </Navbar.Section>
        </Navbar>
    );
};

const AppshellLayout = ({ children }: LayoutProps) => {
    const router = useRouter();
    return (
        <AppShell
            padding="md"
            fixed={false}
            navbar={<NavBar router={router} />}
            header={
                <Header height="100" px="20" p="xs">
                    <Grid align="center">
                        <Grid.Col span={3}>
                            <Title order={1} ml="md">
                                Group 10
                            </Title>
                        </Grid.Col>
                        <Grid.Col span={9}>
                            <CryptoForm />
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
            <PriceChart />
            <Space h="md" />
            {children}
        </AppShell>
    );
};

export default AppshellLayout;