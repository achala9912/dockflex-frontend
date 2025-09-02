// "use client";

// import React from "react";
// import {
//   Dialog,
//   DialogPanel,
//   DialogTitle,
// } from "@headlessui/react";
// import { X } from "lucide-react";

// interface PopupProps {
//   title: string;
//   headerClassName?: string;
//   isOpen: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// }

// export default function Popup({
//   title,
//   headerClassName,
//   isOpen,
//   onClose,
//   children,
// }: PopupProps) {
//   return (
//     <Dialog 
//       open={isOpen} 
//       onClose={() => {}} 
//       className="relative z-50"
//       static 
//     >
//       {/* Overlay */}
//       <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

//       {/* Container */}
//       <div className="fixed inset-0 flex items-center justify-center p-4">
//         <DialogPanel className="w-full max-w-3xl rounded-lg bg-white shadow-lg">
//           {/* Header */}
//           <div
//             className={`flex items-center justify-between px-6 py-4 border-b bg-blue-600 ${headerClassName}`}
//           >
//             <DialogTitle className="text-base font-medium text-white">
//               {title}
//             </DialogTitle>
//             <button onClick={onClose}>
//               <X className="h-5 w-5 text-white hover:text-red-400" />
//             </button>
//           </div>

//           {/* Body */}
//           <div className="p-6">{children}</div>
//         </DialogPanel>
//       </div>
//     </Dialog>
//   );
// }




"use client";

import React from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";

interface PopupProps {
  title: string;
  headerClassName?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  hasScrollBar?: boolean;
}

export default function Popup({
  title,
  headerClassName,
  isOpen,
  onClose,
  children,
  hasScrollBar = false,
}: PopupProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50" static>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

      {/* Centered container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* Panel: limit height, make column so header is fixed and body scrolls */}
        <DialogPanel
          className={`w-full max-w-3xl rounded-lg bg-white shadow-lg max-h-[85vh] flex flex-col ${
            hasScrollBar ? "min-h-[200px]" : ""
          }`}
        >
          {/* Header (fixed height) */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b ${headerClassName ?? "bg-blue-600"
              } flex-shrink-0`}
          >
            <DialogTitle className="text-base font-medium text-white">
              {title}
            </DialogTitle>
            <button onClick={onClose} aria-label="Close dialog">
              <X className="h-5 w-5 text-white hover:text-red-400" />
            </button>
          </div>

          {/* Body: fills remaining space and becomes scrollable when content is large */}
          <div className="p-6 overflow-y-auto flex-1">{children}</div>

          {/* (Optional) Footer slot could go here — if added, give it flex-shrink-0 so it stays visible */}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
