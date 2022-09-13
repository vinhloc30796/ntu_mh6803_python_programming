from ..source.models import parse_price, BaseCryptoPrice

def test_parse_price(
    prices=[
        [1620000000000, 1234.56],
        [1620000000000, 1234.56],
    ]
):
    crypto_prices = parse_price(prices)
    assert len(crypto_prices) == 2
    for each in crypto_prices:
        assert isinstance(each, BaseCryptoPrice)
        assert each.date == "2021-05-03T08:00:00.000Z"
        assert each.price == 1234.56
    