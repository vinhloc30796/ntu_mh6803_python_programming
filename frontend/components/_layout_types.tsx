import { NextPage } from "next";
import { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

export type LayoutProps = {
    data: any;
    children: React.ReactNode;
};

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (
        page: ReactElement,
        props: AppProps
    ) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};
