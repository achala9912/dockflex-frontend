"use client";

import RoundButton from "@/components/Buttons/RoundButton";
import PrescriptionTemplate from "@/components/Canvas/PrescriptionTemplate";
import Popup from "@/components/Popups/Popup";
import React, { useRef } from "react";
import { BsPrinter } from "react-icons/bs";

interface PrescriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  prescriptionData: any;
}

function PrescriptionPopup({
  isOpen,
  onClose,
  prescriptionData,
}: PrescriptionPopupProps) {
  const prescriptionRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!prescriptionRef.current) return;

    const printIframe = document.createElement("iframe");
    printIframe.style.position = "absolute";
    printIframe.style.top = "-9999px";
    printIframe.style.left = "-9999px";
    document.body.appendChild(printIframe);

    const iframeDoc =
      printIframe.contentDocument || printIframe.contentWindow?.document;

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <title>Print Prescription</title>
            <!-- Include Tailwind & site styles -->
            ${Array.from(document.querySelectorAll("link[rel=stylesheet]"))
              .map((link) => link.outerHTML)
              .join("\n")}
            <style>
              /* Extra fix to ensure proper page layout when printing */
              @page { margin: 20mm; }
              body { font-family: sans-serif; }
            </style>
          </head>
          <body class="${document.body.className}">
            ${prescriptionRef.current.outerHTML}
          </body>
        </html>
      `);
      iframeDoc.close();
      setTimeout(() => {
        printIframe.contentWindow?.focus();
        printIframe.contentWindow?.print();
        document.body.removeChild(printIframe);
      }, 500);
    }
  };

  return (
    <Popup
      title="Prescription"
      isOpen={isOpen}
      onClose={onClose}
      headerClassName="bg-blue-600"
      hasScrollBar={true}
    >
      <div className="flex flex-wrap justify-end gap-4 mb-6">
        <RoundButton
          icon={BsPrinter}
          className="hover:bg-gray-300 bg-gray-500 text-white hover:text-blue-800"
          onClick={handlePrint}
        />
      </div>
      <div ref={prescriptionRef} className="print-prescription">
        <PrescriptionTemplate {...prescriptionData} />
      </div>
    </Popup>
  );
}

export default PrescriptionPopup;
