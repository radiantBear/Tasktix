import { authorize } from "@/lib/security/authorize";

export default async function Page() {
  await authorize();

  return (
    <h1>Home</h1>
  );
}