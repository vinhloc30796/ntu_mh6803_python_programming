import { AppProps } from "next/app";
import type { NextPageWithLayout } from "./_layout_types";

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};
