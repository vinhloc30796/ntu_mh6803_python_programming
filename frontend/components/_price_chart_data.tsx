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

export interface BaseCrypto {
    date: string;
    price: number;
}


// Function to get prices from {BACKEND_URL}/prices/{coin}
export async function getPrices(
    coin: string,
    start_date: string, // YYYY-MM-DD
    end_date: string // YYYY-MM-DD
): Promise<BaseCrypto[]> {
    const response = await fetch(
        `${process.env.BACKEND_URL}/prices/${coin}?start_date=${start_date}&end_date=${end_date}`
    );
    const data = await response.json();
    return data;
}
