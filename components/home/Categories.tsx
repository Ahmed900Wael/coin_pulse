import { fetcher } from "@/lib/coingecko.actions";
import DataTable from "../DataTable";
import Image from "next/image";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

const Categories = async () => {
    const categories = await fetcher<Category[]>("/coins/categories");

    const columns: DataTableColumn<Category>[] = [
        {
            header: "Category",
            cellClassName: "category-cell",
            cell: (category) => category.name,
        },
        {
            header: "Top Gainers",
            cellClassName: "top-gainers-cell",
            cell: (category) =>
                category.top_3_coins.map((coin) => (
                    <Image
                        src={coin}
                        alt={coin}
                        key={coin}
                        width={28}
                        height={28}
                    />
                )),
        },
        {
            header: "24h Change",
            cellClassName: "change-header-cell",
            cell: (category) => {
                const priceChange = category?.market_cap_change_24h || 0;
                const isTrendingUp = priceChange > 0;

                return (
                    <div
                        className={
                            "change-cell " +
                            (isTrendingUp ? "text-green-500" : "text-red-500")
                        }
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
            header: "Market Cap",
            cellClassName: "market-cap-cell",
            cell: (category) => formatCurrency(category.market_cap || 0),
        },
        {
            header: "24h Volume",
            cellClassName: "volume-cell",
            cell: (category) => formatCurrency(category.volume_24h || 0),
        },
    ];

    return (
        <div id="categories" className="custom-scrollbar">
            <h4>Top Categories</h4>

            <DataTable
                data={categories?.slice(0, 10)}
                columns={columns}
                rowKey={(_, index) => index}
            />
        </div>
    );
};

export default Categories;
