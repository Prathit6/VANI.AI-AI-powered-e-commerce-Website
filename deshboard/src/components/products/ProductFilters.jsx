import { Card, CardContent } from "../../utils/basic-ui";

export function ProductFilters() {
  return (
    <Card className="p-4 sticky top-20 h-fit">
      <CardContent>
        <h2 className="text-lg font-semibold mb-3">Filters</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>🔹 Category</p>
          <p>🔹 Price Range</p>
          <p>🔹 Brand</p>
          <p>🔹 Rating</p>
        </div>
      </CardContent>
    </Card>
  );
}