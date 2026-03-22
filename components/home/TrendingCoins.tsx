import { fetcher } from "@/lib/coingecko.actions";
import Image from "next/image";
import Link from "next/link";
import DataTable from "../DataTable";
import { cn, formatPercentage } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

const TrendingCoins = async () => {
    const trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
        "/search/trending",
        undefined,
        300
    );

    const columns: DataTableColumn<TrendingCoin>[] = [
        {
            header: "Name",
            cellClassName: "name-cell",
            cell: (coin) => {
                const item = coin.item;

                return (
                    <Link href={`/coins/${item.id}`}>
                        <Image
                            src={item.large}
                            alt={item.name}
                            width={36}
                            height={36}
                        />
                        <p>{item.name}</p>
                    </Link>
                );
            },
        },
        {
            header: "24h Change",
            cellClassName: "name-cell",
            cell: (coin) => {
                const item = coin.item;
                const priceChange =
                    item?.data?.price_change_percentage_24h?.usd ?? 0;
                const isTrendingUp = priceChange > 0;

                return (
                    <div
                        className={cn(
                            "price-change",
                            isTrendingUp ? "text-green-500" : "text-red-500"
                        )}
                    >
                        <p className="flex items-center gap-1">
                            {isTrendingUp ? (
                                <TrendingUp width={16} height={16} />
                            ) : (
                                <TrendingDown width={16} height={16} />
                            )}
                            {formatPercentage(priceChange)}
                        </p>
                    </div>
                );
            },
        },
        {
            header: "Price",
            cellClassName: "price-cell",
            cell: (coin) => {
                const price = coin.item?.data?.price;

                if (typeof price !== "number" || !isFinite(price)) {
                    return "—";
                }

                const formattedPrice = price.toFixed(2);
                return (
                    "$" + formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                );
            },
        },
    ];

    return (
        <div id="trending-coins">
            <h4>Trending Coins</h4>
            <DataTable
                data={trendingCoins.coins.slice(0, 6) ?? []}
                columns={columns}
                rowKey={(coin) => coin.item.id}
                tableClassName="trending-coins-table"
                headerCellClassName="py-3!"
                bodyCellClassName="py-2!"
            />
        </div>
    );
};

export default TrendingCoins;
