# Base
import logging
from typing import Dict, List, Any

# CLI
import asyncio
import threading
from fire import Fire

# GUI
import tkinter as tk
from tkinter import ttk, messagebox
from ttkthemes import ThemedTk
from PIL import Image, ImageTk

# Plot
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

# Owned
from cli import show_chart, calc_metrics
from source.main import get_granularity, calculate_years_to_retire
from source.async_client import get_async_client, get_price, get_coin_description


####################
# 0. Layout
####################

logging.basicConfig(
    level=logging.INFO,
)

# Constants
window_font = "Calibri"
style_title = ("Arial", 10, "bold")
style_parag = ("Arial", 10)
color_bg = "floralwhite"

# Globals
time_prices: List = []
prices: List[float] = []
description = ""
granularity = ""


def make_window() -> ThemedTk:
    main_window = ThemedTk(theme="adapta")

    # Implement header image
    logo = Image.open("Crypto-Tracker.png")
    resize_logo = logo.resize((200, 100))
    logo = ImageTk.PhotoImage(resize_logo, master=main_window)
    logo_label = tk.Label(main_window, image=logo)
    logo_label.image = logo
    # logo_label.pack(side="top")

    # Define Tkinter styles (buttons, labelframes etc)
    style = ttk.Style(main_window)
    style.configure("TFrame", background="gainsboro")

    style.configure(
        "W.TButton",
        font=(window_font, 10, "bold"),
        background="gray25",
        relief="raised",
    )

    style.configure(
        "N.TButton",
        font=(window_font, 10, "bold"),
        background="red",
        relief="raised",
    )
    return main_window


####################
# 1. Price
####################


def make_coin_input_frame(main_window: ThemedTk) -> ttk.LabelFrame:
    style = ttk.Style(main_window)
    style.configure("I.TLabel", background="whitesmoke")
    style.configure(
        "I.TLabelframe",
        background="whitesmoke",
        relief="solid",
        borderwidth=2,
    )
    style.configure(
        "I.TLabelframe.Label",
        font=(window_font, 14, "bold"),
        background="#ee911d",
    )
    # Init the frame
    input_frame = ttk.LabelFrame(
        main_window,
        text="User Inputs",
        style="I.TLabelframe",
    )
    # input_frame.pack(fill="x", expand=True, side="top")
    input_frame.grid(
        row=0,
        column=0,
        columnspan=2,
    )
    return input_frame


def make_coin_input_entries(coin_input_frame: ttk.LabelFrame) -> Dict[str, str]:
    # Ask for user input
    offset = 3
    messages = {
        "coin": "Please select one coin (e.g. bitcoin, ethereum): ",
        "start_date": "Please enter a start date for the coin selected (yyyy-mm-dd format, eg. 2021-12-31): ",
        "end_date": "Please enter an end date for the coin selected (yyyy-mm-dd format, eg. 2021-12-31): ",
    }
    coin_inputs = {}
    for i, (key, message) in enumerate(messages.items()):
        label = ttk.Label(
            coin_input_frame,
            text=message,
            font=style_title,
            style="I.TLabel",
        )
        label.grid(row=i + offset, column=0, sticky="w", pady=2)
        input_box = ttk.Entry(coin_input_frame, width=30)
        input_box.grid(row=i + offset, column=1, sticky="w", pady=2)
        coin_inputs[key] = input_box
    print(coin_inputs)
    return coin_inputs


def pull_prices(
    async_loop,
    coin: str,
    start_date: str,
    end_date: str,
):
    """ Button-Event-Handler starting the asyncio part. """
    threading.Thread(
        target=_thread_pull_prices, 
        args=(
            async_loop,
            coin,
            start_date,
            end_date,
        )
    ).start()


def _thread_pull_prices(
    async_loop,
    coin: str,
    start_date: str,
    end_date: str,
):
    async_loop.run_until_complete(async_pull_prices(
        coin,
        start_date,
        end_date,
    ))


async def async_pull_prices(
    coin: str,
    start_date: str,
    end_date: str,
):
    """ Creating and starting 10 tasks. """
    global time_prices
    global prices
    global granularity
    client = get_async_client()

    print(coin, start_date, end_date)
    
    try:
        time_prices = await get_price(client, coin, start_date, end_date)
        prices = [price for _, price in time_prices]
        granularity = get_granularity(start_date, end_date)
        logging.info("DATA PULL DONE!")
    except Exception as e:
        messagebox.showerror("Error", str(e))
    finally:
        await client.close()


def button_handler_coin_show_chart(
    main_window: ThemedTk,
    loop,
    coin_input_frame: ttk.LabelFrame, 
    coin_inputs: Dict[str, str]
) -> None:
    print(coin_inputs)
    # Submit the values
    submit_coin_button = ttk.Button(
        coin_input_frame,
        text="Submit",
        command=lambda: trigger_render_chart(
            main_window,
            loop,
            coin_inputs.get("coin").get(),
            coin_inputs.get("start_date").get(),
            coin_inputs.get("end_date").get(),
        ),
        style="W.TButton",
    )
    submit_coin_button.grid(row=6, column=1)

    # Input frame
    return None


def trigger_render_chart(
    main_window: ThemedTk,
    loop,
    coin: str,
    start_date: str,
    end_date: str,
) -> None:
    
    global time_prices
    global prices
    global granularity
    
    logging.info("SUBMITTED!")
    pull_prices(loop, coin, start_date, end_date)

    # Render the chart
    fig, ax = show_chart(
        time_prices=time_prices,
        granularity=granularity,
    )
    chart_window = tk.Toplevel(main_window)
    chart_canvas = FigureCanvasTkAgg(fig, master=chart_window)
    # chart_canvas.get_tk_widget().pack(side=tk.TOP, fill=tk.BOTH, expand=True)
    chart_canvas.get_tk_widget().grid(row=0, column=0)
    chart_canvas.draw()

    # Render the metrics & description
    output_frame = make_output_frame(main_window)
    trigger_show_metrics(output_frame)    
    trigger_show_description(coin, output_frame)

    # Retirement calcs
    qns_frame = make_retirement_next_step_frame(main_window)
    frame_output_retirement = trigger_retirement_next_step(main_window, qns_frame, prices, granularity)

    return prices, granularity


def make_output_frame(main_window: ThemedTk) -> ttk.LabelFrame:
    # Output frame
    style = ttk.Style(main_window)
    style.configure(
        "O.TLabelframe",
        background=color_bg,
        relief="solid",
        borderwidth=2,
    )
    style.configure(
        "O.TLabelframe.Label",
        font=(window_font, 14, "bold"),
        background="#f4c474",
    )

    # Init the frame
    output_frame = ttk.LabelFrame(
        main_window,
        text="Results",
        style="O.TLabelframe",
    )
    # output_frame.pack(fill="x", expand=True)
    output_frame.grid(
        row=1,
        column=0,
        columnspan=2,
    )
    style.configure("O.TLabel", background=color_bg)
    return output_frame


def trigger_show_metrics(
    output_frame: ttk.LabelFrame,
) -> None:
    global prices
    global granularity
    print(prices)
    
    tk_row_num = 7
    style_name = "O.TLabel"
    metrics = calc_metrics(prices, granularity)

    for metric, value in metrics.items():
        print(f"Current loop: {tk_row_num}, {metric}, {value}")
        # label_str = f"{metric}: "
        # value_str = f"$ {value:0.2f}"
        # Branch
        if "Price" in metric:
            label_str = f"{metric}: "
            value_str = '$'+ str(round(value, 2))
        else:
            label_str = f"{metric}: "
            value_str = str(round(value*100, 2)) + '%'
        # Label
        metric_label = ttk.Label(
            output_frame,
            text=label_str,
            font=style_title,
            style=style_name,
        )
        metric_label.grid(row=tk_row_num, column=0, sticky="w", pady=2)
        # value
        value_label = ttk.Label(
            output_frame,
            text=value_str,
            font=style_parag,
            style=style_name,
        )
        value_label.grid(row=tk_row_num, column=1, sticky="w", pady=2)
        tk_row_num += 1

    return None


def trigger_show_description(
    coin: str,
    output_frame: ttk.LabelFrame,
) -> ttk.Frame:
    # Description
    global description
    client = get_async_client()

    # Chart
    try:
        ## Price & Description
        description = get_coin_description(client, coin)
    except Exception as e:
        messagebox.showerror("Error", str(e))
    finally:
        loop.run_until_complete(client.close())

    # Display
    style_name = "O.TLabel"
    description_label = ttk.Label(
        output_frame,
        text=description,
        font=style_title,
        style=style_name,
    )
    description_label.grid(row=1, column=0, columnspan=2, sticky="w", pady=2)


####################
# 2. Retirement
####################


def make_retirement_next_step_frame(main_window: ThemedTk) -> ttk.LabelFrame:
    style = ttk.Style(main_window)
    style.configure(
        "Q.TLabelframe",
        background="oldlace",
        relief="solid",
        borderwidth=2,
    )
    style.configure(
        "Q.TLabelframe.Label",
        font=(window_font, 14, "bold"),
        background="#b1925a",
    )
    qns_frame = ttk.LabelFrame(
        main_window,
        text="Question",
        style="Q.TLabelframe",
    )
    # qns_frame.pack(fill="x", side="bottom")
    qns_frame.grid(
        row=3,
        column=0,
        columnspan=2,
    )
    style.configure(
        "Q.TLabel",
        background="oldlace",
    )

    # Q frame
    return qns_frame


def trigger_retirement_next_step(
    main_window: ThemedTk,
    qns_frame: ttk.LabelFrame,
    prices: List[float],
    granularity: str,
) -> ttk.Frame:
    # Ask user if interested to plan their own wealth
    ask_user_if_plan_wealth = ttk.Label(
        qns_frame,
        text="Would you like to use the wealth planning tool?"
        + " (Clicking 'No' exits the program entirely)",
        font=("Arial", 10),
        style="Q.TLabel",
    )
    ask_user_if_plan_wealth.grid(row=18, column=0, sticky="w", pady=2)

    get_rich_button = ttk.Button(
        qns_frame,
        text="Yes",
        command=lambda: render_retirement_winđow(
            main_window,
            prices=prices,
            granularity=granularity,
        ),
        style="W.TButton",
    )
    get_rich_button.grid(row=18, column=2, padx=5, sticky="e")

    remain_poor_button = ttk.Button(
        qns_frame, text="No", command=main_window.destroy, style="N.TButton"
    )
    remain_poor_button.grid(row=18, column=3, padx=5, sticky="e")


def render_retirement_winđow(
    main_window: ThemedTk,
    prices: List[float],
    granularity: str = "daily",
) -> None:
    (
        wealth_window,
        wealth_input_frame,
        wealth_output_frame,
        wealth_exit_frame,
        wealth_attainment_time,
        starting_asset_entry,
        retirement_goal_entry,
    ) = make_retirement_frame(main_window)
    trigger_show_retirement(
        wealth_attainment_time=wealth_attainment_time,
        prices=prices,
        starting_asset_entry=starting_asset_entry,
        retirement_goal_entry=retirement_goal_entry,
        wealth_input_frame=wealth_input_frame,
        granularity=granularity,
    )
    trigger_exit_button(
        wealth_window, 
        wealth_exit_frame,
    )


def make_retirement_frame(main_window: ThemedTk) -> ttk.LabelFrame:
    # Create new window for wealth management
    wealth_window = tk.Toplevel(main_window)
    wealth_window.title("Wealth Planner")
    wealth_window.geometry("550x300")

    wealth_input_frame = ttk.LabelFrame(
        wealth_window,
        text="User Inputs",
        style="I.TLabelframe",
    )
    # wealth_input_frame.pack(fill="x", expand=True, side="top")
    wealth_input_frame.grid(
        row=0,
        column=0,
        columnspan=2,
    )

    wealth_output_frame = ttk.LabelFrame(
        wealth_window,
        text="Results",
        style="O.TLabelframe",
    )
    # wealth_output_frame.pack(fill="x", expand=True)
    wealth_output_frame.grid(
        row=1,
        column=0,
        columnspan=2,
    )

    wealth_exit_frame = ttk.LabelFrame(
        wealth_window,
        text="Exit",
        style="Q.TLabelframe",
    )
    # wealth_exit_frame.pack(fill="x", side="bottom")
    wealth_exit_frame.grid(
        row=2,
        column=0,
        columnspan=2,
    )

    # Starting asset (i.e. net worth)
    start_msg = ttk.Label(
        wealth_input_frame,
        text="Please enter your current net worth: ",
        font=("Arial", 10),
        style="I.TLabel",
    )
    start_msg.grid(row=0, column=0, pady=2)

    starting_asset_entry = ttk.Entry(wealth_input_frame)
    starting_asset_entry.grid(row=0, column=1, pady=2)

    # Retirement goal
    goal_msg = ttk.Label(
        wealth_input_frame,
        text="Please enter the retirement monetary goal you want to achieve: ",
        font=("Arial", 10),
        style="I.TLabel",
    )
    goal_msg.grid(row=1, column=0, pady=2)

    retirement_goal_entry = ttk.Entry(wealth_input_frame)
    retirement_goal_entry.grid(row=1, column=1, pady=2)

    # Placeholder for text explaining how long it takes to attain wealth goal
    wealth_attainment_time = ttk.Label(
        wealth_output_frame,
        text="",
        font=("Arial", 10),
        wraplength=350,
        style="O.TLabel",
    )
    wealth_attainment_time.grid(row=5, column=0, sticky="w", pady=2)
    return (
        wealth_window,
        wealth_input_frame,
        wealth_output_frame,
        wealth_exit_frame,
        wealth_attainment_time,
        starting_asset_entry,
        retirement_goal_entry,
    )


def trigger_show_retirement(
    wealth_input_frame: ttk.LabelFrame,
    wealth_attainment_time: ttk.Label,
    prices: List[float],
    starting_asset_entry: ttk.Entry,
    retirement_goal_entry: ttk.Entry,
    granularity: str = "daily",
):

    # Submit user's inputs
    submit_wealth_button = ttk.Button(
        wealth_input_frame,
        text="Submit",
        command=lambda: [
            render_retirement_config(
                wealth_attainment_time=wealth_attainment_time,
                prices=prices,
                starting_asset=float(starting_asset_entry.get()),
                retirement_goal=float(retirement_goal_entry.get()),
                granularity=granularity,
            )
        ],
        style="W.TButton",
    )
    submit_wealth_button.grid(row=3, column=1)


def trigger_exit_button(
    wealth_window: ThemedTk,
    wealth_exit_frame: ttk.LabelFrame,
):
    # Exit button
    exit_program_button = ttk.Button(
        wealth_exit_frame,
        text="Exit Program",
        command=wealth_window.destroy,
        style="N.TButton",
    )
    exit_program_button.grid(row=7, column=2, sticky="e", padx=10, pady=2)

    wealth_window.mainloop()

    # Return
    return None


def render_retirement_config(
    wealth_attainment_time: ttk.Label,
    prices: List[float],
    starting_asset: float,
    retirement_goal: float,
    granularity: str = "daily",
) -> float:

    # Calculate
    years_to_retire: float = calculate_years_to_retire(
        starting_asset=starting_asset,
        retirement_goal=retirement_goal,
        prices=prices,
        granularity=granularity,
    )
    years = int(years_to_retire)
    months = int(years_to_retire % 1.0 * 12)
    message = (
        f"""Assuming that your returns are constant (= end price / start price), """
    )
    message += f"""You will retire in {years_to_retire:0.2f} years (roughly {years} years, {months} months)"""
    wealth_attainment_time.config(text=message)

    return years_to_retire


def main(loop) -> None:
    global prices
    global granularity    

    # Main screen
    main_window = make_window()
    main_window.title("Home")
    main_window.geometry("950x600")

    # Input & output screen
    coin_input_frame = make_coin_input_frame(main_window)
    coin_inputs = make_coin_input_entries(coin_input_frame)

    # Price chart
    button_handler_coin_show_chart(main_window, loop, coin_input_frame, coin_inputs)

    main_window.mainloop()
    loop.close()


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    main(loop)
