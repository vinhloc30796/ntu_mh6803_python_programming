import React, { useRef, useState, useMemo, useEffect } from "react";
// import appleStock, { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";
import { scaleTime, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { Brush } from "@visx/brush";
import BaseBrush, {
    BaseBrushState,
    UpdateBrush,
} from "@visx/brush/lib/BaseBrush";
import { BrushHandleRenderProps } from "@visx/brush/lib/BrushHandle";
import { Bounds } from "@visx/brush/lib/types";
import { PatternLines } from "@visx/pattern";
import { LinearGradient } from "@visx/gradient";
import { ScaleSVG } from "@visx/responsive";
import { min, max, extent } from "d3-array";

// Owned
import AreaChart from "./_price_chart_area";
import { dummyCrypto, BaseCrypto, getPrice, getDate } from "./_price_chart_data";

// Initialize some variables
// const stock = appleStock.slice(1000);
const LEFT_MARGIN = 50;
const RIGHT_MARGIN = 20;
const brushMargin = { top: 10, bottom: 0, left: LEFT_MARGIN, right: RIGHT_MARGIN };
const chartSeparation = 30;
const PATTERN_ID = "brush_pattern";
const GRADIENT_ID = "brush_gradient";
export const accentColor = "#f6acc8";
export const background = "#584153";
export const background2 = "#af8baf";
const selectedBrushStyle = {
    fill: `url(#${PATTERN_ID})`,
    stroke: "white",
};

// const getDate = (d: AppleStock) => new Date(d.date);
// const getStockValue = (d: AppleStock) => d.close;

export type BrushProps = {
    priceData: BaseCrypto[];
    width: number;
    height: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    compact?: boolean;
};

function BrushChart({
    priceData,
    width,
    height,
    margin = {
        top: 20,
        bottom: 10,
        left: LEFT_MARGIN,
        right: RIGHT_MARGIN,
    },
    compact = false,
}: BrushProps) {
    // Rerender component when stock changes
    const [receivedPriceData, updateReceivedPriceData] = useState(dummyCrypto);
    const [filteredStock, setFilteredStock] = useState(receivedPriceData);
    const brushRef = useRef<BaseBrush | null>(null);
    useEffect(() => {
        const priceDataCopy = [...priceData];
        updateReceivedPriceData(priceDataCopy);
        brushRef.current?.reset();
        console.log("in ../components/_price_chart_brush.tsx: Type of priceData: ", typeof priceData, priceData);
    }, [priceData]);
    
    
    const onBrushChange = (domain: Bounds | null) => {
        if (!domain) return;
        const { x0, x1, y0, y1 } = domain;
        const stockCopy = receivedPriceData.filter((s) => {
            const x = getDate(s).getTime();
            const y = getPrice(s);
            return x > x0 && x < x1 && y > y0 && y < y1;
        });
        setFilteredStock(stockCopy);
    };

    const innerHeight = height - margin.top - margin.bottom; //margin.bottom;
    const topChartBottomMargin = compact
        ? chartSeparation / 2
        : chartSeparation + 10;
    const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;
    const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;

    // bounds
    const xMax = useMemo(
        () => Math.max(width - margin.left - margin.right, 0), 
        [width, receivedPriceData, priceData]
    );
    const yMax = useMemo(
        () => Math.max(topChartHeight, 0), 
        [topChartHeight, receivedPriceData, priceData]
    );
    const yMin = useMemo(
        () => Math.min(topChartHeight, 0), 
        [topChartHeight, receivedPriceData, priceData]
    );
    const xBrushMax = useMemo(
        () => Math.max(width - brushMargin.left - brushMargin.right, 0),
        [width, receivedPriceData, priceData]
    );
    const yBrushMax = useMemo(
        () => Math.max(
            bottomChartHeight - brushMargin.top - brushMargin.bottom,
            0
        ),
        [bottomChartHeight, receivedPriceData, priceData]
    );

    // scales
    const dateScale = useMemo(
        () =>
            scaleTime<number>({
                range: [0, xMax],
                domain: extent(filteredStock, getDate) as [Date, Date],
            }),
        [xMax, filteredStock, receivedPriceData]
    );
    const stockScale = useMemo(
        () =>
            scaleLinear<number>({
                range: [yMax, yMin],
                domain: [min(filteredStock, getPrice), max(filteredStock, getPrice) || 0],
                nice: true,
            }),
        [yMax, filteredStock, receivedPriceData]
    );
    const brushDateScale = useMemo(
        () =>
            scaleTime<number>({
                range: [0, xBrushMax],
                domain: extent(receivedPriceData, getDate) as [Date, Date],
            }),
        [xBrushMax, receivedPriceData]
    );
    const brushStockScale = useMemo(
        () =>
            scaleLinear({
                range: [yBrushMax, 0],
                domain: [min(receivedPriceData, getPrice), max(receivedPriceData, getPrice) || 0],
                nice: true,
            }),
        [yBrushMax, receivedPriceData]
    );

    const initialBrushPosition = useMemo(
        () => ({
            start: { x: brushDateScale(getDate(receivedPriceData[1])) },
            end: { x: brushDateScale(getDate(receivedPriceData[20])) },
        }),
        [brushDateScale, receivedPriceData]
    );
    

    return (
        <div>
            <ScaleSVG width={width} height={height}>
                <LinearGradient
                    id={GRADIENT_ID}
                    from={background}
                    to={background2}
                    rotate={45}
                />
                <rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill={`url(#${GRADIENT_ID})`}
                    rx={4}
                />
                <AreaChart
                    hideBottomAxis={compact}
                    data={filteredStock}
                    width={width}
                    margin={{ ...margin, bottom: topChartBottomMargin }}
                    yMax={yMax}
                    xScale={dateScale}
                    yScale={stockScale}
                    gradientColor={background2}
                />
                <AreaChart
                    hideBottomAxis
                    hideLeftAxis
                    data={receivedPriceData}
                    width={width}
                    yMax={yBrushMax}
                    xScale={brushDateScale}
                    yScale={brushStockScale}
                    margin={brushMargin}
                    top={topChartHeight + topChartBottomMargin + margin.top}
                    gradientColor={background2}
                >
                    <PatternLines
                        id={PATTERN_ID}
                        height={8}
                        width={8}
                        stroke={accentColor}
                        strokeWidth={1}
                        orientation={["diagonal"]}
                    />
                    <Brush
                        xScale={brushDateScale}
                        yScale={brushStockScale}
                        width={xBrushMax}
                        height={yBrushMax}
                        margin={brushMargin}
                        handleSize={8}
                        innerRef={brushRef}
                        resizeTriggerAreas={["left", "right"]}
                        brushDirection="horizontal"
                        initialBrushPosition={initialBrushPosition}
                        onChange={onBrushChange}
                        onClick={() => setFilteredStock(receivedPriceData)}
                        selectedBoxStyle={selectedBrushStyle}
                        useWindowMoveEvents
                        renderBrushHandle={(props) => (
                            <BrushHandle {...props} />
                        )}
                    />
                </AreaChart>
            </ScaleSVG>
        </div>
    );
}
// We need to manually offset the handles for them to be rendered at the right position
const BrushHandle = ({ x, height, isBrushActive }: BrushHandleRenderProps) => {
    const pathWidth = 8;
    const pathHeight = 15;
    if (!isBrushActive) {
        return null;
    }
    return (
        <Group left={x + pathWidth / 2} top={(height - pathHeight) / 2}>
            <path
                fill="#f2f2f2"
                d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
                stroke="#999999"
                strokeWidth="1"
                style={{ cursor: "ew-resize" }}
            />
        </Group>
    );
};

export default BrushChart;
