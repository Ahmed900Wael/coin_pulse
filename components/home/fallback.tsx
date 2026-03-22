import DataTable from "../DataTable";

export const CoinOverviewFallback = () => {
    return (
        <div id="coin-overview-fallback">
            <div className="header pt-2">
                <div className="w-14 h-14 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="info">
                    <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse mb-2"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

const fallbackColumns: DataTableColumn<unknown>[] = [
    {
        header: <div className="h-4 bg-gray-300 rounded w-12 animate-pulse" />,
        cell: () => (
            <div className="flex items-center">
                <div className="w-9 h-9 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-24 ml-2 animate-pulse"></div>
            </div>
        ),
    },
    {
        header: <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />,
        cell: () => (
            <div className="h-4 bg-gray-300 rounded w-12 animate-pulse" />
        ),
    },
    {
        header: <div className="h-4 bg-gray-300 rounded w-12 animate-pulse" />,
        cell: () => (
            <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />
        ),
    },
];

const fallbackData = Array(6).fill({});

export const TrendingCoinsFallback = () => {
    return (
        <div id="trending-coins-fallback">
            <h4 className="mb-4">Trending Coins</h4>
            <DataTable
                columns={fallbackColumns}
                data={fallbackData}
                rowKey={(_, index) => index}
                tableClassName="trending-coins-table"
                headerCellClassName="py-3!"
                bodyCellClassName="py-2!"
            />
        </div>
    );
};

const categoriesFallbackColumns: DataTableColumn<any>[] = [
    {
        header: <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />,
        cell: () => (
            <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
        ),
    },
    {
        header: <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />,
        cell: () => (
            <div className="flex gap-1">
                <div className="w-7 h-7 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="w-7 h-7 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="w-7 h-7 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
        ),
    },
    {
        header: <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />,
        cell: () => (
            <div className="h-4 bg-gray-300 rounded w-12 animate-pulse" />
        ),
    },
    {
        header: <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />,
        cell: () => (
            <div className="h-4 bg-gray-300 rounded w-16 animate-pulse" />
        ),
    },
    {
        header: <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />,
        cell: () => (
            <div className="h-4 bg-gray-300 rounded w-16 animate-pulse" />
        ),
    },
];

const categoriesFallbackData = Array(10).fill({});

export const CategoriesFallback = () => {
    return (
        <div id="categories-fallback" className="custom-scrollbar">
            <h4>Top Categories</h4>
            <DataTable
                columns={categoriesFallbackColumns}
                data={categoriesFallbackData}
                rowKey={(_, index) => index}
            />
        </div>
    );
};
