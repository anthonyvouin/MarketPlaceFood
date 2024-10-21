import { getCategoriesData } from "@/app/services/category/category";
import ChartCategory from "@/app/components/admin/chart/chart";

export default async function Chart() {
  const categoriesData = await getCategoriesData();

  return (
    <div className=" bg-primaryBackgroundColor">
      <h1 className="text-3xl font-bold mb-6">Page Graphique</h1>
      <ChartCategory categoriesData={categoriesData} />
    </div>
  );
}
