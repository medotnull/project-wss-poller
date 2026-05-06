import Decimal from "decimal.js";

export function toFixedInt(priceStr: string, decimals: number): number {
    return new Decimal(priceStr).mul(new Decimal(10).pow(decimals)).toDecimalPlaces(0).toNumber();
}

//This converts "123456.7891" to an integer like 1234567891 when decimals = 4