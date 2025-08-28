// import PrescriptionTemplate from "@/components/Canvas/PrescriptionLayout";
// import React from "react";

// // Example usage in a page component
// const PrescriptionPage: React.FC = () => {
//   // This would typically come from your API
//   const prescriptionData = {
//     prescriptionNo: "MC0003-S002-20250827-A001-P1",
//     createdAt: "2025-08-27T05:02:20.990Z",
//     patientId: {
//       title: "Mr.",
//       patientName: "Kasun Perera",
//       age: "25Y",
//       contactNo: "0771773680",
//       email: "kasun@gmail.com",
//     },
//     vitalSigns: [
//       {
//         weight: "65kg",
//         height: "180cm",
//         bmi: "20.1",
//         pulseRate: "120/80 mm",
//       },
//     ],
//     reasonForVisit: "Cramp of the left leg",
//     clinicalDetails: "No food allergy and drug allergy",
//     advice: "Take bed rest",
//     medications: [
//       {
//         productName: "Voltaren 50mg Tablet",
//         genericName: "Diclofenac Sodium",
//         dose: "1 tablet",
//         frequency: "two times a day (12H)",
//         duration: "5 Days",
//         note: "",
//       },
//       {
//         productName: "Lomac 20mg Capsule",
//         genericName: "Omeprazole",
//         dose: "1 capsule",
//         frequency: "two times a day (12H)",
//         duration: "5 Days",
//         note: "30 mins before meals",
//       },
//     ],
//     prescriberDetails: {
//       name: "Imesh Batuwangala",
//       specialization: "General Medicine",
//       slmcNo: "SL12345",
//     },
//     centerId: {
//       centerName: "Medicare Pvt Ltd",
//       address: "No 11IC, 20th Lane, Ambillawatta, Borelasgamuwa",
//       email: "info@medicare.com",
//       contactNo: "+94112509243",
//       town: "Colombo",
//     },
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <PrescriptionTemplate prescriptionData={prescriptionData} />
//     </div>
//   );
// };

// export default PrescriptionPage;

import PrescriptionTemplate from "@/components/Canvas/PrescriptionTemplate";
import React from "react";

function page() {
  return (
    <div>
      <PrescriptionTemplate
        patientDetails={{
          name: "Mr. Kasun Perera",
          age: "25Y",
          contact: "0771737680",
          email: "kasun@gmail.com",
        }}
        reasonForVisit="Cramp of the left leg"
        symptoms={["Nausea", "Vomiting", "Runny Nose"]}
        vitalSigns={{
          weight: "65kg",
          height: "180cm",
          bmi: "20.1",
          temp: "29°C",
          pulseRate: "120/80 mm",
        }}
        clinicalDetails="No food allergy and drug allergy"
        advice="Take bed rest"
        medications={[
          {
            name: "Voltaren 50mg Tablet (Diclofenac Sodium)",
            dosage: "1 tablet two times a day (12h) for 5 Days",
            instructions: "",
          },
          {
            name: "Lomac 20mg Capsule (Omeprazole)",
            dosage: "1 capsule two times a day (12h) for 5 Days",
            instructions: "30 mins before meals",
          },
        ]} doctor={{
          name: "Dr. Imesh Batuwangala",
          specialization: "CardioLogist",
          slmcNo: "4434343",
          signatureUrl: "https://img.favpng.com/12/13/20/digital-signature-electronic-signature-png-favpng-0M6hggShV3n6ww2aFrFvv92bK.jpg"
        }}      />
    </div>
  );
}

export default page;
