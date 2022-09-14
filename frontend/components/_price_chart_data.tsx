import { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";

// accessors
export const getDate = (d: BaseCrypto | AppleStock) => new Date(d.date);
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


// Dummy data
export const dummyCrypto: BaseCrypto[] = [
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