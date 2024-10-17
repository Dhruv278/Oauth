// app/page.tsx (or Home component file)
// Since this component doesn't use useSession, it can be a Server Component by default.
import Homepage from "@/Components/Homepage";

export default function Home() {
  return <Homepage />;
}
