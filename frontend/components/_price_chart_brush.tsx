import React, { useRef, useState, useMemo } from "react";
import appleStock, { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";
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
import { max, extent } from "d3-array";

// Owned
import AreaChart from "./_price_chart_area";
import { getPrice, getPrices, BaseCrypto, getDate } from "./_price_chart_data";

// Initialize some variables
// const stock = appleStock.slice(1000);
// Dummy Data 
const stock: BaseCrypto[] = [
    {
        date: "2021-01-01T00:00:00.000Z",
        price: 100
    },
    {
        date: "2021-01-02T00:00:00.000Z",
        price: 200
    },
    {
        date: "2021-01-03T00:00:00.000Z",
        price: 300
    },
    {
        date: "2021-01-04T00:00:00.000Z",
        price: 400
    },
    {
        date: "2021-01-05T00:00:00.000Z",
        price: 500
    },
    {
        date: "2021-01-06T00:00:00.000Z",
        price: 600
    },
    {
        date: "2021-01-07T00:00:00.000Z",
        price: 700
    },
    {
        date: "2021-01-08T00:00:00.000Z",
        price: 800
    },
    {
        date: "2021-01-09T00:00:00.000Z",
        price: 900
    },
    {
        date: "2021-01-10T00:00:00.000Z",
        price: 1000
    },
    {
        date: "2021-01-11T00:00:00.000Z",
        price: 1100
    },
    {
        date: "2021-01-12T00:00:00.000Z",
        price: 1200
    },
    {
        date: "2021-01-13T00:00:00.000Z",
        price: 1300
    },
    {
        date: "2021-01-14T00:00:00.000Z",
        price: 1400
    },
    {
        date: "2021-01-15T00:00:00.000Z",
        price: 1500
    },
    {
        date: "2021-01-16T00:00:00.000Z",
        price: 1600
    },
    {
        date: "2021-01-17T00:00:00.000Z",
        price: 1700
    },
    {
        date: "2021-01-18T00:00:00.000Z",
        price: 1800
    },
    {
        date: "2021-01-19T00:00:00.000Z",
        price: 1900
    },
    {
        date: "2021-01-20T00:00:00.000Z",
        price: 2000
    },
    {
        date: "2021-01-21T00:00:00.000Z",
        price: 2100
    },
    {
        date: "2021-01-22T00:00:00.000Z",
        price: 2200
    },
    {
        date: "2021-01-23T00:00:00.000Z",
        price: 2300
    },
    {
        date: "2021-01-24T00:00:00.000Z",
        price: 2400
    },
    {
        date: "2021-01-25T00:00:00.000Z",
        price: 2500
    },
    {
        date: "2021-01-26T00:00:00.000Z",
        price: 2600
    },
    {
        date: "2021-01-27T00:00:00.000Z",
        price: 2700
    },
    {
        date: "2021-01-28T00:00:00.000Z",
        price: 2800
    },
    {
        date: "2021-01-29T00:00:00.000Z",
        price: 2900
    },
    {
        date: "2021-01-30T00:00:00.000Z",
        price: 3000
    },
    {
        date: "2021-01-31T00:00:00.000Z",
        price: 3100
    },
    {
        date: "2021-02-01T00:00:00.000Z",
        price: 3200
    },
    {
        date: "2021-02-02T00:00:00.000Z",
        price: 3300
    },
    {
        date: "2021-02-03T00:00:00.000Z",
        price: 3400
    },
    {
        date: "2021-02-04T00:00:00.000Z",
        price: 3500
    }
]
const brushMargin = { top: 10, bottom: 0, left: 0, right: 0 };
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
    width: number;
    height: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    compact?: boolean;
};

function BrushChart({
    compact = false,
    width,
    height,
    margin = {
        top: 20,
        left: 0,
        bottom: 10,
        right: 0,
    },
}: BrushProps) {
    // await stock = getPrices("bitcoin", "2019-01-01", "2019-03-01").data;
    const brushRef = useRef<BaseBrush | null>(null);
    const [filteredStock, setFilteredStock] = useState(stock);

    const onBrushChange = (domain: Bounds | null) => {
        if (!domain) return;
        const { x0, x1, y0, y1 } = domain;
        const stockCopy = stock.filter((s) => {
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
    const xMax = Math.max(width - margin.left - margin.right, 0);
    const yMax = Math.max(topChartHeight, 0);
    const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
    const yBrushMax = Math.max(
        bottomChartHeight - brushMargin.top - brushMargin.bottom,
        0
    );

    // scales
    const dateScale = useMemo(
        () =>
            scaleTime<number>({
                range: [0, xMax],
                domain: extent(filteredStock, getDate) as [Date, Date],
            }),
        [xMax, filteredStock]
    );
    const stockScale = useMemo(
        () =>
            scaleLinear<number>({
                range: [yMax, 0],
                domain: [0, max(filteredStock, getPrice) || 0],
                nice: true,
            }),
        [yMax, filteredStock]
    );
    const brushDateScale = useMemo(
        () =>
            scaleTime<number>({
                range: [0, xBrushMax],
                domain: extent(stock, getDate) as [Date, Date],
            }),
        [xBrushMax]
    );
    const brushStockScale = useMemo(
        () =>
            scaleLinear({
                range: [yBrushMax, 0],
                domain: [0, max(stock, getPrice) || 0],
                nice: true,
            }),
        [yBrushMax]
    );

    const initialBrushPosition = useMemo(
        () => ({
            start: { x: brushDateScale(getDate(stock[1])) },
            end: { x: brushDateScale(getDate(stock[20])) },
        }),
        [brushDateScale]
    );

    // event handlers
    const handleClearClick = () => {
        if (brushRef?.current) {
            setFilteredStock(stock);
            brushRef.current.reset();
        }
    };

    const handleResetClick = () => {
        if (brushRef?.current) {
            const updater: UpdateBrush = (prevBrush) => {
                const newExtent = brushRef.current!.getExtent(
                    initialBrushPosition.start,
                    initialBrushPosition.end
                );

                const newState: BaseBrushState = {
                    ...prevBrush,
                    start: { y: newExtent.y0, x: newExtent.x0 },
                    end: { y: newExtent.y1, x: newExtent.x1 },
                    extent: newExtent,
                };

                return newState;
            };
            brushRef.current.updateBrush(updater);
        }
    };

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
                    data={stock}
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
                        onClick={() => setFilteredStock(stock)}
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
