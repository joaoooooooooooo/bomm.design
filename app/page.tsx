import { redirect } from "next/navigation";
import { defaultSection } from "@/features/navigation/sections";
export default function Home() {
  redirect(`/${defaultSection}`);
}
