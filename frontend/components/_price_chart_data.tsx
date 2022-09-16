import { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";
import { bisector } from "d3-array";
import { timeFormat } from 'd3-time-format';
import { 
    init_coin,
    init_start_date,
    init_end_date,
} from "./_consts";

// accessors
export const getDate = (d: BaseCrypto | AppleStock) => new Date(d.date);
export const bisectDate = bisector<BaseCrypto | AppleStock, Date>((d) => new Date(d.date)).left;
export const formatDate = timeFormat("%b %d, '%y");
export const getPrice = (d: BaseCrypto | AppleStock) => {
    if ("close" in d) {
        return d.close;
    } else {
        return d.price;
    }
};
export const getLastPrice = (stock: BaseCrypto[]) => {
    const lastStock = stock[stock.length - 1];
    return getPrice(lastStock);
}

export interface BaseCrypto {
    date: string;
    price: number;
}

export type Metrics = {
    "Price - Open": number,
    "Price - Close": number,
    "Price - High": number,
    "Price - Low": number,
    "Returns, Annualized": number,
    "Volatility, Annualized": number
}


// Function to get prices from {BACKEND_URL}/prices/{coin}
export async function extractPrices(
    coin: string,
    start_date: Date, 
    end_date: Date 
): Promise<BaseCrypto[]> {
    // Prep to get start_date_str and end_date_str in YYYY-MM-DD format
    const start_date_str  = start_date.toISOString().split("T")[0];
    const end_date_str  = end_date.toISOString().split("T")[0];
    // Extract
    const response: Response = await fetch(
        `${process.env.BACKEND_URL}/prices/${coin}?start_date=${start_date_str}&end_date=${end_date_str}`
    );
    const data = await response.json();
    // Convert to BaseCrypto
    const prices: BaseCrypto[] = data.map((d: any) => {
        return {
            date: d.date,
            price: d.price,
        };
    });
    return prices;
}


export async function extractMetrics(
    coin: string,
    start_date: Date,
    end_date: Date
): Promise<Object> {
    // Prep to get start_date_str and end_date_str in YYYY-MM-DD format
    const start_date_str  = start_date.toISOString().split("T")[0];
    const end_date_str  = end_date.toISOString().split("T")[0];
    // Extract
    const response: Response = await fetch(
        `${process.env.BACKEND_URL}/metrics/${coin}?start_date=${start_date_str}&end_date=${end_date_str}`
    );
    const data = await response.json();
    console.log("extractMetrics", "data", data);
    return data;
}


// Dummy data
export const dummyCryptoPromise = extractPrices(
    init_coin,
    init_start_date,
    init_end_date
);
export const dummyMetricsPromise = extractMetrics(
    init_coin,
    init_start_date,
    init_end_date,
);
export const dummyCrypto = [
    { date: "2020-01-01", price: 100 },
    { date: "2020-01-02", price: 101 },
    { date: "2020-01-03", price: 102 },
    { date: "2020-01-04", price: 103 },
    { date: "2020-01-05", price: 104 },
    { date: "2020-01-06", price: 105 },
    { date: "2020-01-07", price: 106 },
    { date: "2020-01-08", price: 107 },
    { date: "2020-01-09", price: 108 },
    { date: "2020-01-10", price: 109 },
    { date: "2020-01-11", price: 110 },
    { date: "2020-01-12", price: 111 },
    { date: "2020-01-13", price: 112 },
    { date: "2020-01-14", price: 113 },
    { date: "2020-01-15", price: 114 },
    { date: "2020-01-16", price: 115 },
    { date: "2020-01-17", price: 116 },
    { date: "2020-01-18", price: 117 },
    { date: "2020-01-19", price: 118 },
    { date: "2020-01-20", price: 119 },
    { date: "2020-01-21", price: 120 },
    { date: "2020-01-22", price: 121 },
    { date: "2020-01-23", price: 122 },
    { date: "2020-01-24", price: 123 },
    { date: "2020-01-25", price: 124 },
    { date: "2020-01-26", price: 125 },
    { date: "2020-01-27", price: 126 },
    { date: "2020-01-28", price: 127 },
    { date: "2020-01-29", price: 128 },
    { date: "2020-01-30", price: 129 },
    { date: "2020-01-31", price: 130 },
]