import { WindowProvider } from "@/components/os/WindowContext";
import { Desktop } from "@/components/os/Desktop";

export default function Dashboard() {
  return (
    <WindowProvider>
      <Desktop />
    </WindowProvider>
  );
}
