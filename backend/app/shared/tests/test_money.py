from decimal import Decimal

import pytest

from app.shared.money import CurrencyMismatchError, InvalidAmountError, Money


def test_amount_is_rounded_half_up_to_two_places() -> None:
    assert Money.of("1.005", "USD").amount == Decimal("1.01")
    assert Money.of("1.004", "USD").amount == Decimal("1.00")


def test_addition_and_subtraction_keep_exact_decimals() -> None:
    total = Money.of("0.10", "USD") + Money.of("0.20", "USD")
    assert total == Money.of("0.30", "USD")
    assert total - Money.of("0.30", "USD") == Money.zero("USD")


def test_float_amounts_are_rejected() -> None:
    with pytest.raises(InvalidAmountError):
        Money.of(0.1, "USD")  # type: ignore[arg-type]


def test_mixed_currencies_cannot_be_combined() -> None:
    with pytest.raises(CurrencyMismatchError):
        Money.of(1, "USD") + Money.of(1, "EUR")


def test_times_rounds_the_result() -> None:
    assert Money.of("9.99", "USD").times(3) == Money.of("29.97", "USD")
    assert Money.of("0.99", "USD").times("0.5") == Money.of("0.50", "USD")


def test_comparison_and_negation() -> None:
    assert Money.of(1, "USD") < Money.of(2, "USD")
    assert (-Money.of(1, "USD")).is_negative()


@pytest.mark.parametrize("currency", ["us", "usd", "USDX", ""])
def test_currency_must_be_three_uppercase_letters(currency: str) -> None:
    with pytest.raises(InvalidAmountError):
        Money.of(1, currency)


def test_non_numeric_and_non_finite_amounts_are_rejected() -> None:
    with pytest.raises(InvalidAmountError):
        Money.of("abc", "USD")
    with pytest.raises(InvalidAmountError):
        Money.of("NaN", "USD")
