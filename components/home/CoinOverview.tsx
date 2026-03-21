"use client";

import { fetcher } from "@/lib/coingecko.actions";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CoinOverviewFallback } from "./fallback";
import CandlestickChart from "../CandlestickChart";

const CoinOverview = () => {
    const [coin, setCoin] = useState<CoinDetailsData | null>(null);
    const [coinOHLCData, setCoinOHLCData] = useState<OHLCData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [liveInterval, setLiveInterval] = useState<"1s" | "1m">("1m");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coinData, ohlcData] = await Promise.all([
                    fetcher<CoinDetailsData>("/coins/bitcoin", {
                        dex_pair_format: "symbol",
                    }),
                    fetcher<OHLCData[]>("/coins/bitcoin/ohlc", {
                        vs_currency: "usd",
                        days: 1,
                        precision: "full",
                    }),
                ]);
                setCoin(coinData);
                setCoinOHLCData(ohlcData);
            } catch (error) {
                console.error("Error fetching coin overview:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading || !coin || !coinOHLCData) {
        return <CoinOverviewFallback />;
    }

    return (
        <div id="coin-overview">
            <CandlestickChart
                data={coinOHLCData}
                coinId="bitcoin"
                liveInterval={liveInterval}
                setLiveInterval={setLiveInterval}
            >
                <div className="header pt-2">
                    <Image
                        src={coin.image.large}
                        alt={coin.name}
                        width={56}
                        height={56}
                    />
                    <div className="info">
                        <p>
                            {coin.name} / {coin.symbol.toUpperCase()}
                        </p>
                        <h1>
                            {formatCurrency(coin.market_data.current_price.usd)}
                        </h1>
                    </div>
                </div>
            </CandlestickChart>
        </div>
    );
};

export default CoinOverview;
