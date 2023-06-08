import {
  Page,
  LegacyCard,
  DataTable,
  TableData,
  Filters,
  TextField,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";

function SortableDataTable() {
  const [sortedRows, setSortedRows] = useState(null);

  const [data, setData] = useState([]); // State to hold the fetched data

  useEffect(() => {
    (async () => {
      const API_URI = `https://my-json-server.typicode.com/SahilMund/ecarts/products`;
      const response = await fetch(API_URI);

      const json = await response.json();

      console.log(json);
      setData(json);
    })();
  }, []);

  const initiallySortedRows = data?.map((item) => [
    item.id,
    item.title,
    `$${item.price.toFixed(2)}`,
    item.rating.rate,
  ]);

  const rows = sortedRows ? sortedRows : initiallySortedRows;

  const handleSort = useCallback(
    (index, direction) =>
      setSortedRows(
        index === 2
          ? sortCurrency(rows, index, direction)
          : sortRating(rows, index, direction)
      ),
    [rows]
  );

  return (
    <Page title="Sales by product">
      <LegacyCard>
        <DataTable
          columnContentTypes={["text", "text", "text", "text"]}
          headings={["id", "Title", "Price", "Rate"]}
          rows={rows}
          sortable={[false, false, true, true]}
          defaultSortDirection="descending"
          initialSortColumnIndex={4}
          onSort={handleSort}
        />
      </LegacyCard>
    </Page>
  );

  function sortCurrency(rows, index, direction) {
    console.log(index);

    return [...rows].sort((rowA, rowB) => {
      const amountA = parseFloat((rowA[index] || 0).toString().substring(1));
      const amountB = parseFloat((rowB[index] || 0).toString().substring(1));

      return direction === "descending" ? amountB - amountA : amountA - amountB;
    });
  }
  function sortRating(rows, index, direction) {
    console.log(index);
    return [...rows].sort((rowA, rowB) => {
      const rateA = parseInt(rowA[index] || 0);
      const rateB = parseInt(rowB[index] || 0);

      return direction === "descending" ? rateB - rateA : rateA - rateB;
    });
  }
}

export default SortableDataTable;
