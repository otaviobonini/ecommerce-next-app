import { useUser } from "@/app/context/UserContext";

export default function UserProfile() {
  const { user } = useUser();
  return <div></div>;
}
