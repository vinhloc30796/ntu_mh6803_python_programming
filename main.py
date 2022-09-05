# Base
from typing import List, Dict, Tuple, Optional

# Data
import time
import requests
import pandas as pd
import numpy as np
from datetime import datetime

# Plotting
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

# CLI
from fire import Fire

coins = ["bitcoin", "ethereum"]
MULTIPLIERS = {
    "daily": 365,
    "hourly": 365 * 24,
    "minutely": 365 * 24 * 60,
}


def get_unix_from_today(days_from_today: int) -> int:
    current_unix = int(round(time.time()))
    return current_unix - (days_from_today * 24 * 60 * 60), current_unix


def get_price(
    coin: str,
    start_unix: Optional[int] = None,
    end_unix: Optional[int] = None,
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
    if (not start_unix) or (not end_unix):
        start_unix, end_unix = get_unix_from_today(2)

    api_url = "https://api.coingecko.com/api/v3/"
    endpoint = f"coins/{coin}/market_chart/range/"

    params = {
        "vs_currency": vs_currency,
        "from": start_unix,
        "to": end_unix,
    }

    response = requests.get(api_url + endpoint, params=params)
    return response.json()["prices"]


def convert_date_to_unix(date_str: str) -> int:
    ### Loc Nguyen ###
    """
    Take in a date in format YYYY-MM-DD
    and return the UNIX time

    Params:
    - date_str (str)
    Outputs:
    - date_unix (int)
    """
    return int(datetime.strptime(date_str, "%Y-%m-%d").timestamp())


def convert_dates_to_unix(start_date: str, end_date: str) -> Tuple[int, int]:
    """
    Take in start_date and end_date (in YYYY-MM-DD)
    and return the UNIX times

    (assumes the user is based in Singapore)

    Params:
    - start_date (str)
    - end_date (str)
    Outputs:
    - start_unix (int)
    - end_unix (int)

    Reference: https://www.epochconverter.com/
    """
    start_unix = convert_date_to_unix(start_date)
    end_unix = convert_date_to_unix(end_date)
    return start_unix, end_unix


def get_user_input_for_chart() -> Tuple[str, str, str]:
    ### Li ZhuangJing ###
    """
    Function to print out messages
    to take in user requests for charting
    and return the requests if valid

    Params: None
    Outputs:
    - coin (str)
    - start_date (str)
    - end_date (str)
    """
    msg = "TODO"
    coin = input("Please select one coin (e.g. bitcoin, ethereum): ")

    # TODO: Fill out
    start_date = input("Please enter a start date for the coin selected: ")

    end_date = input("Please enter an end date for the coin selected: ")

    return coin, start_date, end_date  # Tuple


def show_chart(export: bool = False) -> None:
    ### Loc Nguyen ###
    """
    The main function

    1) get the user input
    2) get the price data
    3) show the chart (TODO)
    """
    # Input & process
    coin, start_date, end_date = get_user_input_for_chart()
    start_unix, end_unix = convert_dates_to_unix(start_date, end_date)
    # Get price
    time_prices: List[List[int, float]] = get_price(coin, start_unix, end_unix)

    fig, ax = plt.subplots(figsize=(10, 5))
    times = [
        mdates.date2num(datetime.fromtimestamp(each[0] / 1000.0))
        for each in time_prices
    ]
    prices = [each[1] for each in time_prices]
    ax.plot(times, prices)
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%d/%m/%Y"))

    if export:
        filename = f"./{coin},{start_date}--{end_date}.png"
        ax.figure.savefig(filename)
        print(f"Saved to {filename}!")

    # Display
    return ax


def get_user_input_for_retirement() -> float:
    ### Li ZhuangJing ###
    """
    Function to print out messages
    to take in user requests for retirement planning
    and return the requests if valid

    Param: None
    Output:
    - retirement_goal (float) e.g. 150,000.00 or 1,000,000.05
    """
    msg = "Please enter the retirement monetary goal you want to achieve: "
    retirement_goal = float(input(msg))
    return retirement_goal


def calculate_returns(prices: List[float], granularity: str = "daily") -> float:
    ### Chen Zhu ###
    """
    Take in the list of prices (default to daily granularity)
    and return the annualized returns

    by:
    - calculating the returns from prices (end price - start price)
    - annualizing the average returns according to granularity

    Params:
    - prices (list of floats)
    - granularity (str): can be "daily", "hourly", "minutely" - defaults to daily
    Output:
    - returns (float): the annualized returns (e.g. 0.2345 or 23.45%)
    """
    # Calculate returns
    returns = ((prices[-1] - prices[0]) / prices[0] + 1) ** (1 / (len(prices) - 1))

    # Annualize according to MULTIPLIERS
    mult = MULTIPLIERS.get(granularity)
    if mult:
        annual_return = returns**mult - 1
        return annual_return
    raise ValueError(
        "Unsupported granularity. Has to be one of: daily, hourly, minutely"
    )


def calculate_high(prices: List[float]) -> float:
    ### Samuel ###

    """
    Take in the list of prices (default to daily granularity)
    and return the high.

    Params:
    - prices (list of floats)
    Output:
    - the high
    """
    try:
        if float(min(prices)) < 0:
            raise Exception("There is a negative prices")
        else:
            return float(max(prices))
    except ValueError:
        print("This is an empty list")


def calculate_low(prices: List[float]) -> float:
    ### Samuel ###
    """
    Take in the list of prices (default to daily granularity)
    and return the low.

    Params:
    - prices (list of floats)
    Output:
    - the low
    """
    try:
        if float(min(prices)) < 0:
            raise Exception("There is a negative prices")
        else:
            return float(min(prices))
    except ValueError:
        print("This is an empty list")


def calculate_volatility(
    prices: List[float], granularity: str = "daily"
) -> float:
    ### Louis
    """
    Take in the list of prices (default to daily granularity)
    and return the volatility.

    Params:
    - prices (list of floats)
    Output:
    - volatility
    """
    # Convert CoinGecko's price output into a Pandas Dataframe
    price_df = pd.DataFrame(prices, columns=["Price"])

    # Calculate historical annualised volatility
    # by taking the log-return of daily price movements,
    # calculating it's variance,
    # then multiply it by 365,
    # then take it's square root to get the standard deviation
    log_ret = np.log(price_df["Price"] / price_df["Price"].shift())
    var = np.var(log_ret)

    # Annualize
    mult = MULTIPLIERS.get(granularity)
    if mult:
        volatility = np.sqrt(var * mult)
        return volatility

    raise ValueError(
        "Unsupported granularity. Has to be one of: daily, hourly, minutely"
    )


def calculate_years_to_retire(
    starting_asset: float,
    retirement_goal: float,
    prices: List[float],
    granularity: str = "daily",
) -> float:

    """
    Params:
    - starting_asset (float) e.g. 150,000 USD or 300,000 SGD
    - retirement_goal (float) e.g. 150,000 USD or 300,000 SGD
    - prices: and the list of prices (e.g. [1,2,3,4])
    (and optionally, the granularity of the prices data)

    and return how many years it would take to reach the retirement goal.
    """
    pass


def get_coin_description(
    ### Chen Zhu ###
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

    response = requests.get(api_url + endpoint)
    try:
        description = response.json()["description"]["en"].split(".")[:2]
        return ". ".join(description) + "."
    except:
        return f"Error: No description found. Preview: {response}"
        

if __name__ == "__main__":
    Fire()