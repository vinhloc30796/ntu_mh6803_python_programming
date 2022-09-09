# Base
from typing import Optional, Dict, List
from datetime import datetime

# Async
import asyncio
from concurrent.futures import ThreadPoolExecutor
from urllib3.util.retry import Retry

# Server
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from cli import get_prices, show_retirement_goal
from source.main import convert_dates_to_unix
from source.models import BaseCryptoPrice
from source.async_client import get_async_client

# Init server
server = FastAPI()
runner = ThreadPoolExecutor(2)
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
]
server.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@server.on_event("startup")
async def startup_event():
    global async_client
    async_client = await get_async_client()


@server.get("/health")
async def health():
    return {"healthy": True}


@server.get("/prices/{coin}", response_model=List[BaseCryptoPrice])
async def api_prices(
    coin: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    vs_currency: Optional[str] = "sgd",
) -> List[BaseCryptoPrice]:
    """
    Return list of daily closing prices in the format:
    [
        {
            "date": "2021-05-01",
            "price": 1234.56
        },
        ...
    ]
    """
    start_unix, end_unix = convert_dates_to_unix(start_date, end_date)

    # Calculate date time delta range from unix timestamp
    start_datetime = datetime.fromtimestamp(start_unix)
    end_datetime = datetime.fromtimestamp(end_unix)
    days_delta = (end_datetime - start_datetime).days

    # Get prices directly if days_delta is no more than 90
    if days_delta <= 90:
        start_datetime = end_datetime - datetime.timedelta(days=90)
        start_unix = int(start_datetime.timestamp())
        prices = await asyncio.get_event_loop().run_in_executor(
            runner, get_prices, async_client, coin, start_unix, end_unix, vs_currency
        )
        return prices
    else:
        # If larger than 90 days, then chunk into 90 days
        start_end_chunks = []
        while days_delta > 90:
            start_datetime = end_datetime - datetime.timedelta(days=90)
            start_unix = int(start_datetime.timestamp())
            start_end_chunks.append((start_unix, end_unix))
            end_unix = start_unix
            days_delta -= 90
        tasks = []
        for start_unix, end_unix in start_end_chunks:
            tasks.append(
                asyncio.get_event_loop().run_in_executor(
                    runner,
                    get_prices,
                    async_client,
                    coin,
                    start_unix,
                    end_unix,
                    vs_currency,
                )
            )
        prices = await asyncio.gather(*tasks)

    return prices


@server.get("/retirement/{coin}")
async def api_retirement_goal(
    coin: str,
    start_date: str,
    end_date: str,
    starting_asset: float,
    retirement_goal: float,
):
    # Get prices
    loop = asyncio.get_event_loop()
    time_prices = await loop.run_in_executor(
        runner,
        get_prices,
        async_client,
        coin,
        start_date,
        end_date,
    )
    prices = [each[1] for each in time_prices]
    # Calculate
    years_to_retire = show_retirement_goal(
        prices,
        starting_asset,
        retirement_goal,
    )
    return {"years_to_retire": years_to_retire}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(server, host="localhost", port=8000)
