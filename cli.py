# Base
from typing import Dict, List

# Plotting
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

# CLI
from fire import Fire

# Owned code
from source.main import *


def calc_metrics(prices: List[float], granularity: str="daily") -> Dict[str, float]:
    ### Loc Nguyen ###
    """
    Calculate the metrics for the given prices
    """
    metrics: Dict[str, float] = {
        "Price - Open": prices[0],
        "Price - Close": prices[-1],
        "Price - High": calculate_high(prices),
        "Price - Low": calculate_low(prices),
        "Returns, Annualized": calculate_annualized_returns(prices, granularity),
        "Volatility, Annualized": calculate_annualized_volatility(prices, granularity),
    }
    return metrics


def show_chart(
    coin: str,
    start_date: str,
    end_date: str,
    export: bool = False
) -> None:
    ### Loc Nguyen ###
    """
    The main function

    1) get the user input
    2) get the price data
    3) show the chart (TODO)
    """
    # Input & process
    start_unix, end_unix = convert_dates_to_unix(start_date, end_date)
    # Get price
    time_prices: List[List[int, float]] = get_price(coin, start_unix, end_unix)
    prices: List[float] = [each[1] for each in time_prices]

    # Calculate metrics
    metrics = calc_metrics(prices)
    for metric, value in metrics.items():
        if "Price" in metric:
            print(f"{metric}: ${value:,.4f}")
        else:
            print(f"{metric}: {value:0.4%}")

    # Chart
    fig, ax = plt.subplots(figsize=(10, 5))
    times = [
        mdates.date2num(datetime.fromtimestamp(each[0] / 1000.0))
        for each in time_prices
    ]
    ax.plot(times, prices)
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%d/%m/%Y"))

    if export:
        filename = f"./{coin},{start_date}--{end_date}.png"
        ax.figure.savefig(filename)
        print(f"Saved to {filename}!")

    # Display
    return ax


def show_retirement_goal(
    coin: str,
    start_date: str,
    end_date: str,
) -> float:
    starting_asset, retirement_goal = get_user_input_for_retirement()
    start_unix, end_unix = convert_dates_to_unix(start_date, end_date)
    # Get price
    time_prices: List[List[int, float]] = get_price(coin, start_unix, end_unix)
    prices: List[float] = [each[1] for each in time_prices]
    
    # Calculate
    years_to_retire: float = calculate_years_to_retire(
        starting_asset=starting_asset,
        retirement_goal=retirement_goal,
        prices=prices,
    )
    years = int(years_to_retire)
    months = int(years_to_retire % 1.0 * 12)
    print("Assuming that your returns are constant (= end price / start price),", end=" ")
    print(f"You will retire in {years_to_retire:0.2f} years (roughly {years} years, {months} months)")
    return years_to_retire


def main() -> None:
    separator = "-" * 20
    print(separator)
    coin, start_date, end_date = get_user_input_for_chart()
    print(separator)
    ax = show_chart(coin, start_date, end_date, export=True)
    print(separator)
    years_to_retire = show_retirement_goal(coin, start_date, end_date)
    return None


if __name__ == "__main__":
    Fire(main)