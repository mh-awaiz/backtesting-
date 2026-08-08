import Topbar from "@/components/dashboard/Topbar";
import InquiryForm from "@/components/marketing/InquiryForm";

export default function NewProjectPage() {
  return (
    <div className="pb-16">
      <Topbar title="Submit a new project" />
      <div className="px-5 lg:px-8 mt-4 max-w-2xl">
        <InquiryForm compact />
      </div>
    </div>
  );
}
