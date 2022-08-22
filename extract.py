from typing import List, Dict

from fire import Fire
import time
import requests


coins = ["bitcoin", "ethereum"]


def get_unix_timestamp(days_from_today: int) -> int:
    current_unix = int(round(time.time()))
    return current_unix - (days_from_today * 24 * 60 * 60), current_unix


def get_usd_price(
    coin: str, 
    days_from_today: int = 90,
) -> List[List]:
    assert_msg = "days_from_today must be between 1 and 90 (CoinGecko limitation)"
    assert days_from_today >= 1 & days_from_today <= 90, assert_msg

    api_url = "https://api.coingecko.com/api/v3/"
    endpoint = f"coins/{coin}/market_chart/range/"

    from_unix, to_unix = get_unix_timestamp(days_from_today)
    params = {
        "vs_currency": "usd",
        "from": from_unix,
        "to": to_unix,
    }

    response = requests.get(api_url + endpoint, params=params)
    return response.json()["prices"]



def demo(coin: str) -> List[float]:
    if coin not in coins:
        raise ValueError(f"{coin} is not supported")
    return [1.0, 2.0, 3.0]

if __name__ == "__main__":
    # Try running the following command:
    # poetry run python extract.py get_usd_price bitcoin
    Fire()