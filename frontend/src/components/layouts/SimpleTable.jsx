import React from "react";
import { Table } from "react-bootstrap";

const SimpleTable = ({ data, className = "" }) => {
  const columns = data?.columns || [];
  const rows = data?.rows || [];

  return (
    <div className={className}>
      <Table bordered striped hover responsive>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.field || column.label}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((column) => (
                  <td key={`${row.id || rowIndex}-${column.field}`}>
                    {row[column.field] ?? ""}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center" colSpan={columns.length || 1}>
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default SimpleTable;