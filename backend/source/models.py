from typing import List
from pydantic import BaseModel

from datetime import datetime


class BaseCryptoPrice(BaseModel):
    date: str
    price: float


def parse_price(prices: List[List]) -> List[float]:
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
    crypto_prices = [
        BaseCryptoPrice(
            date=(
                datetime
                    .fromtimestamp(date / 1000) # because date is in nanoseconds
                    .strftime("%Y-%m-%dT%H:%M:%S.000Z")
            ),
            price=price
        )
        for (date, price) in prices
    ]
    return crypto_prices
