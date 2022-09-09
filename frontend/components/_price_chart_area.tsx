import React from "react";
import { Group } from "@visx/group";
import { AreaClosed } from "@visx/shape";
import { AxisLeft, AxisBottom, AxisScale } from "@visx/axis";
import { LinearGradient } from "@visx/gradient";
import { curveMonotoneX } from "@visx/curve";
import { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";

// Owned
import { BaseCrypto, getDate, getPrice } from "./_price_chart_data";

// Initialize some variables
const axisColor = "#fff";
const axisBottomTickLabelProps = {
    textAnchor: "middle" as const,
    fontFamily: "Arial",
    fontSize: 10,
    fill: axisColor,
};
const axisLeftTickLabelProps = {
    dx: "-0.25em",
    dy: "0.25em",
    fontFamily: "Arial",
    fontSize: 10,
    textAnchor: "end" as const,
    fill: axisColor,
};


export default function AreaChart({
    data,
    gradientColor,
    width,
    yMax,
    margin,
    xScale,
    yScale,
    hideBottomAxis = false,
    hideLeftAxis = true,
    top,
    left,
    children,
}: {
    data: AppleStock[] | BaseCrypto[];
    gradientColor: string;
    xScale: AxisScale<number>;
    yScale: AxisScale<number>;
    width: number;
    yMax: number;
    margin: { top: number; right: number; bottom: number; left: number };
    hideBottomAxis?: boolean;
    hideLeftAxis?: boolean;
    top?: number;
    left?: number;
    children?: React.ReactNode;
}) {
    if (width < 10) return null;
    return (
        <Group left={left || margin.left} top={top || margin.top}>
            <LinearGradient
                id="gradient"
                from={gradientColor}
                fromOpacity={1}
                to={gradientColor}
                toOpacity={0.2}
            />
            <rect x={0} y={0} width={width} rx={14} />
            <AreaClosed<AppleStock | BaseCrypto>
                data={data}
                x={(d) => xScale(getDate(d)) || 0}
                y={(d) => yScale(getPrice(d)) || 0}
                yScale={yScale}
                strokeWidth={1}
                stroke="url(#gradient)"
                fill="url(#gradient)"
                curve={curveMonotoneX}
            />
            {!hideBottomAxis && (
                <AxisBottom
                    top={yMax}
                    scale={xScale}
                    numTicks={width > 520 ? 6 : 3}
                    stroke={axisColor}
                    tickStroke={axisColor}
                    tickLabelProps={() => axisBottomTickLabelProps}
                    strokeWidth={0}
                />
            )}
            {!hideLeftAxis && (
                <AxisLeft
                    scale={yScale}
                    numTicks={5}
                    stroke={axisColor}
                    tickStroke={axisColor}
                    tickLabelProps={() => axisLeftTickLabelProps}
                />
            )}
            {children}
        </Group>
    );
}
