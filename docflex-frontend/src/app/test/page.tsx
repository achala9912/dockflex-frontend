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
        centerId={{
          centerName: "Golden Care Medical Center",
          contactNo: "0112233445",
          address: "123 Main Street",
          town: "Colombo",
          logo: "https://img.favpng.com/12/13/20/digital-signature-electronic-signature-png-favpng-0M6hggShV3n6ww2aFrFvv92bK.jpg",
          email: "info@goldencare.lk",
        }}
        prescriptionNo="RX-000123"
        createdAt={new Date().toISOString()}
        prescriptionType="OPD"
        patientId={{
          title: "Mr.",
          patientName: "Kasun Perera",
          gender: "Male",
          dob: "2000-01-01",
          age: "25Y",
          contactNo: "0771737680",
          email: "kasun@gmail.com",
        }}
        reasonForVisit="Cramp of the left leg"
        symptoms={["Nausea", "Vomiting", "Runny Nose"]}
        vitalSigns={[
          {
            weight: "65kg",
            height: "180cm",
            bmi: "20.1",
            pulseRate: "72 bpm",
            temp: "36.9°C",
          },
        ]}
        clinicalDetails="No food allergy and drug allergy"
        advice="Take bed rest and drink plenty of fluids."
        remark="Follow up in 2 weeks."
        medications={[
          {
            route: "Oral",
            productName: "Panadol 500mg",
            genericName: "Paracetamol",
            dose: "2g",
            frequency: "8 houlry",
            duration: "5 days",

          },
          {
            route: "Oral",
            productName: "Lomac 20mg",
            genericName: "Omeprazole",
            dose: "20mg",
            frequency: "2 times a day",
            duration: "5 days",
            note: "Take 30 mins before meals",
          },
        ]}
        prescriberDetails={{
          title: "Dr.",
          name: "Imesh Batuwangala",
          specialization: "Cardiologist",
          slmcNo: "SL12345",
          digitalSignature:
            "https://img.favpng.com/12/13/20/digital-signature-electronic-signature-png-favpng-0M6hggShV3n6ww2aFrFvv92bK.jpg",
          remarks: "Consult immediately if pain worsens",
        }}
      />
    </div>
  );
}

export default page;
