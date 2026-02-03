"use server";

import qs from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error("Could not get base url");
if (!API_KEY) throw new Error("Could not get api key");

/**
 * Fetches JSON from the configured CoinGecko-like API for the given endpoint and returns it parsed as `T`.
 *
 * @param endpoint - Path relative to the configured base URL (leading slash optional)
 * @param params - Query parameters to append to the request URL; entries with empty string or `null` are omitted
 * @param revalidate - Cache revalidation time in seconds used by Next.js fetch; defaults to `60`
 * @returns The parsed JSON response typed as `T`
 * @throws Error when the HTTP response has a non-2xx status; message includes the status code and API error message or status text
 */
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
            "x-cg-demo-api-key": API_KEY,
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