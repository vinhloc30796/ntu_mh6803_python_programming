from typing import List
from pydantic import BaseModel

from datetime import datetime


class BaseCryptoPrice(BaseModel):
    date: str
    price: float


async def parse_price(prices: List[List]) -> List[float]:
    """
    Take in the list of prices
    and return the list of prices

    Params:
    - prices (List[List]): The list of prices in the format:
        [
            [timestamp, price],
            ...
        ]

    Output:
    - crypto_prices (List[float]): The list of BaseCryptoPrice:
        [
            BaseCryptoPrice(date="2021-05-01", price=1234.56),
            ...
        ]
    """
    timestamp_unix = [prices[0] for price in prices]
    timestamp_iso_str = [
        datetime.fromtimestamp(date).strftime("%Y-%m-%dT&H:%M:%S.000Z")
        for date in timestamp_unix
    ]

    prices = [price[1] for price in prices]
    crypto_prices = [
        BaseCryptoPrice(date=date, price=price)
        for (date, price) in zip(timestamp_iso_str, prices)
    ]
    return crypto_prices
