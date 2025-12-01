import { DataTable } from "@/components/data-table";
import data from "./data.json";
const Services: React.FC = () => {
  return (
    <div>
      <DataTable data={data} />
    </div>
  );
};

export default Services;
