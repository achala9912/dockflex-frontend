import { IconType } from "react-icons";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdOutlineDashboard } from "react-icons/md";
import { LuUser } from "react-icons/lu";
import { RiStethoscopeLine } from "react-icons/ri";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { AiFillMedicineBox } from "react-icons/ai";
import { FaFilePrescription } from "react-icons/fa6";
import { RiChatVoiceAiFill } from "react-icons/ri";
import { SiSession } from "react-icons/si";
export interface SidebarItem {
  title: string;
  icon?: IconType;
  dropdown?: boolean;
  subItems?: Array<{ title: string; path: string }>;
  path?: string;
  permission?: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: MdOutlineDashboard,
    path: "/home",
  },
  {
    title: "Medical Centres",
    icon: RiStethoscopeLine,
    path: "/medical-centres",
  },
  {
    title: "Acccounts",
    icon: LuUser,
    dropdown: true,
    subItems: [
      { title: "Roles", path: "/accounts/roles" },
      { title: "Users", path: "/accounts/users" },
    ],
  },
  {
    title: "Sessions",
    icon: SiSession,
    path: "/sessions",
  },
  {
    title: "Patient Directory",
    icon: HiOutlineUserGroup,
    path: "/patients",
  },
  {
    title: "Appointments",
    icon: RiCalendarScheduleLine,
    path: "/appointments",
  },

  {
    title: "Medicines Directory",
    icon: AiFillMedicineBox,
    dropdown: true,
    subItems: [
      { title: "Generic Names", path: "/medicines/generic" },
      { title: "Products", path: "/medicines/products" },
    ],
  },
  {
    title: "Prescriptions",
    icon: FaFilePrescription,
    dropdown: true,
    subItems: [
      { title: "Generate", path: "/prescriptions/generate" },
      { title: "Work Flow", path: "/prescriptions/workflow" },
    ],
  },
  {
    title: "Ask Me",
    icon: RiChatVoiceAiFill,
    path: "/askme",
  },
];
