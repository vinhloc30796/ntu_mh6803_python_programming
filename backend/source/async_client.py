# Base
from datetime import datetime
from typing import Optional, List

# HTTP
import asyncio
# import requests
from aiohttp_retry import (
    RetryClient,
    ExponentialRetry,
)

# Libs
from .main import get_default_dates


def get_async_client() -> RetryClient:
    async_options = ExponentialRetry(
        attempts=10, factor=0.5, max_timeout=60, statuses=[429, 502, 503, 504]
    )
    async_client = RetryClient(raise_for_status=False, retry_options=async_options)
    return async_client


async def get_coin_description(
    ### Chen Zhu ###
    async_client: RetryClient,
    coin: str,
) -> str:
    """
    Take in the coin name (e.g. 'bitcoin', 'ethereum')
    and return 2 sentences of description for the coin

    Param:
    - coin (str): The token name
    Output:
    - description (str): The description from CoinGecko

    Reference: https://www.coingecko.com/en/api/documentation at GET /coins/{id}
    """
    api_url = "https://api.coingecko.com/api/v3/"
    endpoint = f"coins/{coin}/"

    # async_options = ExponentialRetry(
    #     attempts=10, factor=0.5, max_timeout=60, statuses=[429, 502, 503, 504]
    # )
    # async_client = RetryClient(raise_for_status=False, retry_options=async_options)

    async with async_client.get(api_url + endpoint) as response:
        response_dict = await response.json()
    try:
        async with response as response:
            description = response_dict["description"]["en"].split(". ")[:2]
        return ". ".join(description) + "."
    except:
        raise ValueError(f"Error: No description found. Preview: {response}")


async def get_price(
    client: RetryClient,
    coin: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    vs_currency: Optional[str] = "sgd",
) -> List[List]:
    """
    Take in the coin name, start_unix, end_unix, and comparison currency
    and return the prices.

    If either start_unix & end_unix are not provided,
    then default to past 2 days (48 hours).

    Params:
    - coin (str) e.g. "bitcoin", "ethereum", "dogecoin"
    - start_unix (int)
    - end_unix (int)
    - vs_currency: either "usd" or "sgd"

    TODO: Update "days_from_today" into "start_date" and "end_date"
    """
    start_unix, end_unix = get_default_dates(start_date, end_date)

    api_url = "https://api.coingecko.com/api/v3/"
    endpoint = f"coins/{coin}/market_chart/range/"
    params = {
        "vs_currency": vs_currency,
        "from": start_unix,
        "to": end_unix,
    }
    async with client.get(api_url + endpoint, params=params) as response:
        response_dict = await response.json()
        prices = response_dict["prices"]
        print(f"Found prices {len(prices)}")
        return prices


async def parse_price(
    prices: List[List],
    granularity: str = "daily",
) -> List[float]:
    """
    Take in the list of prices (default to daily granularity)
    and return the list of prices

    Params:
    - prices (List[List]): The list of prices
    - granularity (str): The granularity of the prices

    Output:
    - prices (List[float]): The list of prices
    """
    timestamp_unix = [prices[0] for price in prices]
    timestamp_iso_str = [
        datetime.fromtimestamp(date).strftime("%Y-%m-%dT&H:%M:%S.000Z")
        for date in timestamp_unix
    ]

    prices = [price[1] for price in prices]
    time_price_dicts = [
        {"date": date, "price": price}
        for (date, price) in zip(timestamp_iso_str, prices)
    ]
    return time_price_dicts
