import { getCategoriesData } from "@/app/services/category/category";
import ChartCategory from "@/app/components/admin/chart/chart";

export default async function Chart() {
  const categoriesData = await getCategoriesData();

  return (
    <div className=" bg-primaryBackgroundColor h-full">
      <ChartCategory categoriesData={categoriesData} />
    </div>
  );
}
