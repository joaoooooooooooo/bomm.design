import { redirect } from "next/navigation";
import { defaultCollection } from "@/features/navigation/sections";
export default function Home() {
  redirect(`/${defaultCollection}`);
}
