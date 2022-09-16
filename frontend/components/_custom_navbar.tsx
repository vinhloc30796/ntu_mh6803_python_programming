import Link from "next/link";
import React from "react";

import { Navbar, NavLink, } from "@mantine/core";

const CustomNavBar = (router) => {
    return (
        <Navbar width={{ base: "25%" }} p="xs">
            <Navbar.Section grow mt="md">
                <Link href="/retire" passHref>
                    <NavLink
                        component="a"
                        label="Retirement Calculator"
                        active={router.pathname === "/retire"}
                    />
                </Link>
            </Navbar.Section>
        </Navbar>
    );
};

export default CustomNavBar;