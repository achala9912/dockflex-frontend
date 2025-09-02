import { IconType } from "react-icons";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdOutlineDashboard } from "react-icons/md";
import { LuUser } from "react-icons/lu";
import {
  RiStethoscopeLine,
  RiCalendarScheduleLine,
  RiChatVoiceAiFill,
} from "react-icons/ri";
import { AiFillMedicineBox } from "react-icons/ai";
import { FaFilePrescription } from "react-icons/fa6";
import { SiSession } from "react-icons/si";
import PERMISSIONS from "@/constants/permissions";

export interface SidebarItem {
  title: string;
  icon?: IconType;
  dropdown?: boolean;
  subItems?: Array<{ title: string; path: string; permission?: string }>;
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
    permission: PERMISSIONS.CENTER_READ,
  },
  {
    title: "Accounts",
    icon: LuUser,
    dropdown: true,
    subItems: [
      {
        title: "Roles",
        path: "/accounts/roles",
        permission: PERMISSIONS.ROLE_READ,
      },
      {
        title: "Users",
        path: "/accounts/users",
        permission: PERMISSIONS.USER_READ,
      },
    ],
  },
  {
    title: "Sessions",
    icon: SiSession,
    path: "/sessions",
    permission: PERMISSIONS.SESSION_MANAGEMENT,
  },
  {
    title: "Patient Directory",
    icon: HiOutlineUserGroup,
    path: "/patients",
    permission: PERMISSIONS.PATIENT_MANAGEMENT,
  },
  {
    title: "Appointments",
    icon: RiCalendarScheduleLine,
    path: "/appointments",
    permission: PERMISSIONS.APPOINTMENT_MANAGEMENT,
  },
  {
    title: "Medicines Directory",
    icon: AiFillMedicineBox,
    dropdown: true,
    subItems: [
      {
        title: "Generic Names",
        path: "/medicines/generic",
        permission: PERMISSIONS.GENERICNAME_MANAGEMENT,
      },
      {
        title: "Products",
        path: "/medicines/products",
        permission: PERMISSIONS.PRODUCT_MANAGEMENT,
      },
    ],
  },
  {
    title: "Prescriptions",
    icon: FaFilePrescription,
    dropdown: true,
    subItems: [
      {
        title: "Generate",
        path: "/prescription/generate",
        permission: PERMISSIONS.PRESCRIPTION_CREATE,
      },
      {
        title: "Work List",
        path: "/prescription/worklist",
        permission: PERMISSIONS.PRESCRIPTION_READ,
      },
    ],
  },
  {
    title: "Ask Me",
    icon: RiChatVoiceAiFill,
    path: "/ask-me",
  },
];
