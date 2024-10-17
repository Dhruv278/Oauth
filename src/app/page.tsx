// app/page.tsx (or Home component file)
// Since this component doesn't use useSession, it can be a Server Component by default.
import Homepage from "@/Components/Homepage";
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Homepage />
    </Suspense>
  );
  
}
