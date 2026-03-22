"use server";

import qs from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;
const API_KEY_HEADER =
    process.env.COINGECKO_API_KEY_HEADER ||
    (BASE_URL?.includes("pro") ? "x-cg-pro-api-key" : "x-cg-demo-api-key");

if (!BASE_URL) throw new Error("Could not get base url");
if (!API_KEY) throw new Error("Could not get api key");

export async function fetcher<T>(
    endpoint: string,
    params?: QueryParams,
    revalidate = 60
): Promise<T> {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_URL}/${endpoint.replace(/^\//, "")}`,
            query: params,
        },
        { skipEmptyString: true, skipNull: true }
    );

    const response = await fetch(url, {
        headers: {
            [API_KEY_HEADER]: API_KEY,
            "Content-Type": "application/json",
        } as Record<string, string>,
        next: { revalidate },
    });

    if (!response.ok) {
        const errorBody: CoinGeckoErrorBody = await response
            .json()
            .catch(() => ({}));

        throw new Error(
            `API Error: ${response.status}: ${
                errorBody.error || response.statusText
            } `
        );
    }

    return await response.json();
}

export async function getPools(
    id: string,
    network?: string | null,
    contractAddress?: string | null
): Promise<PoolData> {
    const fallback: PoolData = {
        id: "",
        address: "",
        name: "",
        network: "",
    };

    if (network && contractAddress) {
        try {
            const poolData = await fetcher<{ data: PoolData[] }>(
                `/onchain/networks/${network}/tokens/${contractAddress}/pools`
            );

            return poolData.data?.[0] ?? fallback;
        } catch (error) {
            console.error("getPools: fetch fallback failed", error, {
                id,
                fallback,
            });
            return fallback;
        }
    }

    try {
        const poolData = await fetcher<{ data: PoolData[] }>(
            "/onchain/search/pools",
            { query: id }
        );

        return poolData.data?.[0] ?? fallback;
    } catch (error) {
        console.error("getPools: pool lookup failed", error, { id });
        return fallback;
    }
}
