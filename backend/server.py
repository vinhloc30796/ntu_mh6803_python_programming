# Async
import asyncio
from concurrent.futures import ThreadPoolExecutor

# Server
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from cli import get_prices, show_retirement_goal

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


@server.get("/health")
async def health():
    return {"healthy": True}


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
