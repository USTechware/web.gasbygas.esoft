import { BusinessVerifcationStatus } from "@/constants/common";
import { useRouter } from "next/navigation";

export default function BusinessVerificationBanner({ status }: { status: "VERIFIED" | "PENDING" | "DENIED" }) {

  const navigate = useRouter();
    const statusConfig = {
      VERIFIED: {
        text: "Your business is verified!",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        icon: "✅",
      },
      PENDING: {
        text: "Your business verification is pending.",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        icon: "⏳",
      },
      DENIED: {
        text: "Your business verification was rejected. Please update your documents.",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        icon: "❌",
      },
    };
  
    const { text, bgColor, textColor, icon } = statusConfig[status] || {};
  
    return (
      <div className={`mb-2 p-4 rounded-lg ${bgColor} flex items-center gap-3`}>
        <span className="text-lg">{icon}</span>
        <span className={`font-medium ${textColor}`}>{text}</span>
        {
          status === BusinessVerifcationStatus.DENIED &&
          <span className="text-sm text-blue-500 cursor-pointer" onClick={() => navigate.push('/settings/profile')}>Upload Documents</span>
        }
      </div>
    );
  }
  