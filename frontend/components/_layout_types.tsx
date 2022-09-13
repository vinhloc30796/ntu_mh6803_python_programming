import { NextPage } from "next";
import { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

export type LayoutProps = {
    children: React.ReactNode;
};

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};
