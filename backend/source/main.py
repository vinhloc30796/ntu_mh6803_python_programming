# Base
from typing import List, Tuple

# Data
import time
import pandas as pd
import numpy as np
from datetime import datetime

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
    # Starting asset (i.e. net worth)
    start_msg = "Please enter your current net worth: "
    starting_asset = float(input(start_msg))

    # Retirement goal
    goal_msg = "Please enter the retirement monetary goal you want to achieve: "
    retirement_goal = float(input(goal_msg))

    # Return
    return starting_asset, retirement_goal


def calculate_annualized_returns(
    prices: List[float], granularity: str = "daily"
) -> float:
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
    assert (
        len(prices) > 1
    ), "Error: Not enough prices to calculate returns (at least 2 prices)!"

    # Annualize according to MULTIPLIERS
    mult = MULTIPLIERS.get(granularity)
    if mult:
        returns = prices[-1] / prices[0]
        invested_for = len(prices) - 1
        annual_returns = returns ** (mult / invested_for) - 1
        return annual_returns
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


def calculate_years_to_retire(
    starting_asset: float,
    retirement_goal: float,
    prices: List[float],
    granularity: str = "daily",
) -> float:
    ### Li ZhuangJing ###
    """
    Calculate the number of years to retire
    assuming that returns are constant
    and calculated from the list of prices (as close price / open price, annualized)

    Args:
    - starting_asset (float) e.g. 150,000 USD or 300,000 SGD
    - retirement_goal (float) e.g. 150,000 USD or 300,000 SGD
    - prices: and the list of prices (e.g. [1,2,3,4])
    (and optionally, the granularity of the prices data)

    Outputs:
    - years_to_retire (float) e.g. 10.5
    """
    # Prep & test
    annual_returns = calculate_annualized_returns(prices, granularity)
    target_returns = retirement_goal / starting_asset
    if target_returns <= 1:
        return 0  # Already there!

    # Calc
    years_to_retire = target_returns ** (1 / annual_returns) - 1
    if annual_returns <= 0:
        raise ValueError("The annual returns is non-positive. You will never retire!")
    return years_to_retire


def calculate_annualized_volatility(
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


if __name__ == "__main__":
    Fire()
