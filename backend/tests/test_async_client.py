import pytest
from ..source.async_client import *

@pytest.mark.asyncio
async def test_get_price():
    btc_prices = await get_price(get_async_client(), "bitcoin")
    assert len(btc_prices) == 2160  # should return 48 values (2 days * 24 hours)
    assert isinstance(btc_prices[0][0], int)  # first elem of Tuple should be UNIX time
    assert isinstance(
        btc_prices[0][1], float
    )  # second elem of Tuple should be float price

@pytest.mark.asyncio
async def test_get_desc():
    expected_output = "Bitcoin is the first successful internet money based on peer-to-peer technology; whereby no central bank or authority is involved in the transaction and production of the Bitcoin currency. It was created by an anonymous individual/group under the name, Satoshi Nakamoto."
    actual_output = await get_coin_description(get_async_client(), "bitcoin")
    assert actual_output == expected_output, f"Actual: {actual_output}"