import Link from "next/link";
import ProductionForm from "../components/ProductionForm";

const page = () => {
  return (
    <div>
      Form
      <ProductionForm />
      <Link href='/'>Back</Link>
    </div>
  )
}

export default page
