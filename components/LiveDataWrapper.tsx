"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useCoinGeckoWebSocket } from "@/hooks/useCoinGeckoWebSocket";
import { formatCurrency, timeAgo } from "@/lib/utils";
import CandlestickChart from "@/components/CandlestickChart";
import DataTable from "./DataTable";
import CoinHeader from "./CoinHeader";

const LiveDataWrapper = ({
    children,
    coinId,
    poolId,
    coin,
    coinOHLCData = [],
}: LiveDataProps) => {
    const [liveInterval, setLiveInterval] = useState<"1s" | "1m">("1s");
    const { trades, ohlcv, price } = useCoinGeckoWebSocket({
        coinId,
        poolId,
        liveInterval,
    });

    const tradeColumns: DataTableColumn<Trade>[] = [
        {
            header: "Price",
            cellClassName: "price-cell",
            cell: (trade: Trade) =>
                trade.price ? formatCurrency(trade.price) : "-",
        },
        {
            header: "Amount",
            cellClassName: "amount-cell",
            cell: (trade: Trade) => trade.amount?.toFixed(4) ?? "-",
        },
        {
            header: "Value",
            cellClassName: "value-cell",
            cell: (trade: Trade) =>
                trade.value ? formatCurrency(trade.value) : "-",
        },
        {
            header: "Buy/Sell",
            cellClassName: "type-cell",
            cell: (trade: Trade) => (
                <span
                    className={
                        trade.type === "b" ? "text-green-500" : "text-red-500"
                    }
                >
                    {trade.type === "b" ? "Buy" : "Sell"}
                </span>
            ),
        },
        {
            header: "Time",
            cellClassName: "time-cell",
            cell: (trade: Trade) =>
                trade.timestamp ? timeAgo(trade.timestamp) : "-",
        },
    ];

    return (
        <section id="live-data-wrapper">
            <CoinHeader
                name={coin.name}
                image={coin.image.large}
                livePrice={
                    price?.usd ?? coin.market_data?.current_price?.usd ?? 0
                }
                livePriceChangePercentage24h={
                    price?.change24h ??
                    coin.market_data?.price_change_percentage_30d_in_currency
                        ?.usd ??
                    0
                }
                priceChangePercentage30d={
                    coin.market_data.price_change_percentage_30d_in_currency
                        ?.usd ?? 0
                }
                priceChange24h={
                    coin.market_data.price_change_24h_in_currency?.usd ?? 0
                }
            />
            <Separator className="divider" />

            <div className="trend">
                <CandlestickChart
                    liveOhlcv={ohlcv}
                    initialPeriod="daily"
                    liveInterval={liveInterval}
                    setLiveInterval={setLiveInterval}
                    coinId={coinId}
                    data={coinOHLCData}
                >
                    <h4>Trending Overview</h4>
                </CandlestickChart>
            </div>

            <Separator className="divider" />

            {tradeColumns && (
                <div className="trades">
                    <h4>Recent Trades</h4>

                    <DataTable
                        columns={tradeColumns}
                        data={trades}
                        rowKey={(_, index) => index}
                        tableClassName="trades-table"
                    />
                </div>
            )}
        </section>
    );
};

export default LiveDataWrapper;
