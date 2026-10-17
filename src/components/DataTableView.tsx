import type { Cell, DataTable, Locale } from "@/data/types";

function cellText(cell: Cell, locale: Locale) {
  return typeof cell === "string" ? cell : cell[locale];
}

/** Renders a bilingual technical table. Language-neutral string cells are shown LTR. */
export function DataTableView({ table, locale }: { table: DataTable; locale: Locale }) {
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-sand-200">
      <table className="data-table bg-white">
        {table.caption && <caption className="p-3 text-start text-sm font-semibold">{table.caption[locale]}</caption>}
        <thead>
          <tr>
            {table.columns.map((c, i) => (
              <th key={i} scope="col">
                {c[locale]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="font-semibold text-forest-900">
                    {cellText(cell, locale)}
                  </th>
                ) : (
                  <td key={i} className={typeof cell === "string" ? "ltr-num whitespace-nowrap text-ink-700" : "min-w-[10.5rem] text-ink-700"}>
                    {cellText(cell, locale)}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
