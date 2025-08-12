import Recharts from "./components/Recharts";
import NavButton from "./components/NavButton";


export default function Home () {
  
  return (
    <div>
      <h2 className="tw-p-5 tw-text-[#FFBB28]">Dashboard</h2>
      <Recharts />
      <NavButton />
    </div>
  );
}
