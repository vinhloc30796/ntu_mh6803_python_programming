from main import *

def test_get_price():
    btc_prices = get_price("bitcoin") 
    assert len(btc_prices) == 48 # should return 48 values (2 days * 24 hours)
    assert isinstance(btc_prices[0][0], int) # first elem of Tuple should be UNIX time
    assert isinstance(btc_prices[0][1], float) # second elem of Tuple should be float price

def test_get_desc():
    expected_output = "Bitcoin is the first successful internet money based on peer-to-peer technology; whereby no central bank or authority is involved in the transaction and production of the Bitcoin currency. It was created by an anonymous individual/group under the name, Satoshi Nakamoto."
    assert get_coin_description("bitcoin") == expected_output

def test_date_conversions():
    assert convert_dates_to_unix("2022-07-01", "2022-08-01") == (1656604800, 1659283200) # (1656633600, 1659312000)

def test_calc_returns():    
    assert calculate_returns([1.0, 0.5, 1.01], granularity="daily") - 5.146823108963284 <= 1e-5, "Should be 5.146823108963284"

def test_hilo():
    assert calculate_high([1.0, 2.4, 5.0, 4.5, 0.1, 0.9]) == 5
    assert calculate_low([1.0, 2.0]) == 1.0

def test_calc_vol():
    assert calculate_volatility([1.0, 2.0], "daily") == 0.0, "Vol should be 0.0 (because there's only one returns)"
    assert calculate_volatility([1.0, 1.5, 2.25], "daily") == 0.0, "Vol should be 0.0 (because returns are consistent)"

def test_calc_retirement():
    assert calculate_years_to_retire(1, 1, [1]) == 0, "Should take 0 years to retire (because goal = start)."
    assert calculate_years_to_retire(1, .5, [1]) == 0, "Should take 0 years to retire (because goal < start)."
    assert calculate_years_to_retire(1, 2, [1, 1.01]) == 0, "Should take 0 years to retire (because goal < start)."

