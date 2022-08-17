from typing import List
from fire import Fire

coins = ["BTC", "ETH"]


def demo(coin: str) -> List[float]:
    if coin not in coins:
        raise ValueError(f"{coin} is not supported")
    return [1.0, 2.0, 3.0]

if __name__ == "__main__":
    # Try running the following command:
    # poetry run python extract.py BTC
    Fire(demo)