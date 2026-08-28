export const dynamic = "force-dynamic";

import Topbar from "@/components/dashboard/Topbar";
import ChatClientList from "@/components/dashboard/ChatClientList";

export default function DeveloperChatsPage() {
  return (
    <div className="pb-16">
      <Topbar title="Chats" />
      <div className="px-5 lg:px-8 mt-4">
        <p className="text-sm text-text-dim mb-5 max-w-2xl">
          Any client can be reached here, not just ones assigned to you — jump in if a
          conversation needs a hand.
        </p>
        <ChatClientList basePath="/developer/chats" />
      </div>
    </div>
  );
}
