import { TUserRole } from "@/Redux/services/userApi/User.interface";

const roleClasses: Record<string, string> = {
  customer: "bg-gray-200 text-gray-800",
  admin: "bg-green-100 text-green-800",
  super_admin: "bg-blue-100 text-blue-800",
  editor: "bg-purple-100 text-purple-800",
};

export function RoleBadge({ role }: { role: TUserRole }) {
  // Use the mapped color or fallback to gray if the role isn't defined above
  const colorClass = roleClasses[role] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`px-3 py-1 text-xs font-bold text-center capitalize rounded-md inline-flex items-center justify-center ${colorClass}`}
    >
      {role.replace("_", " ")}
    </span>
  );
}
