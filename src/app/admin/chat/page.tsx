export const dynamic = "force-dynamic";

import Topbar from "@/components/dashboard/Topbar";
import ChatClientList from "@/components/dashboard/ChatClientList";

export default function AdminChatPage() {
  return (
    <div className="pb-16">
      <Topbar title="Chat" />
      <div className="px-5 lg:px-8 mt-4">
        <p className="text-sm text-text-dim mb-5 max-w-2xl">
          Every client&apos;s conversation in one place. Any admin or developer can open and
          reply here — the developer shown on a project is just who&apos;s primarily handling it.
        </p>
        <ChatClientList basePath="/admin/chat" />
      </div>
    </div>
  );
}
