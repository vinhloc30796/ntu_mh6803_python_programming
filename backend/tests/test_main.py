from ..source.main import *

def test_date_conversions():
    assert convert_dates_to_unix("2022-07-01", "2022-08-01") == (
        1656604800,
        1659283200,
    )  # (1656633600, 1659312000)


def test_calc_returns():
    tests = [
        ([1.0, 1.01], 36.7834),
        ([1.0, 0.5, 1.01], 5.1468),
        ([1.0, 0.5, 0.75, 1.25, 2.01, 3.01, 4.01, 1.01], 0.6801),
    ]
    for input, expected in tests:
        assert abs(
            calculate_annualized_returns(input) - expected
        ), f"Should be within 0.0001 of expected ({expected:0.4%})"


def test_hilo():
    assert calculate_high([1.0, 2.4, 5.0, 4.5, 0.1, 0.9]) == 5
    assert calculate_low([1.0, 2.0]) == 1.0


def test_calc_vol():
    assert (
        calculate_annualized_volatility([1.0, 2.0], "daily") == 0.0
    ), "Vol should be 0.0 (because there's only one returns)"
    assert (
        calculate_annualized_volatility([1.0, 1.5, 2.25], "daily") == 0.0
    ), "Vol should be 0.0 (because returns are consistent)"


def test_calc_retirement():
    # Zero years
    test_zero_years = [
        (1, 1, [1, 1.1]),
        (1, 0.5, [1, 1.1]),
    ]
    for start, end, prices in test_zero_years:
        assert calculate_years_to_retire(start, end, prices) == 0, "Should be 0 years"

    # Some years
    test_some_years = [
        (1, 2, [1, 1.001], 3.828014159422275),
        (1, 3, [1, 2, 3, 4, 5, 6, 7, 1.01], 4.03003608075736),
    ]
    for start, end, prices, expected in test_some_years:
        assert (
            abs(calculate_years_to_retire(start, end, prices) - expected) < 1e-4
        ), f"Should be within 0.0001 of expected ({expected:0.4%})"
