import { GCC_COUNTRIES, ROLE_STATUS, APPLICATION_STATUS, READINESS_LABEL } from "./constants";

export const MOCK_HOSPITALS = [
  {
    id: "hosp_1",
    name: "Oasis Health City",
    country: GCC_COUNTRIES.UAE,
    city: "Dubai",
    departments: ["Cardiology", "Neurology", "Orthopedics"],
  },
  {
    id: "hosp_2",
    name: "Desert View Medical Center",
    country: GCC_COUNTRIES.SAUDI_ARABIA,
    city: "Riyadh",
    departments: ["Pediatrics", "Internal Medicine", "Emergency"],
  },
  {
    id: "hosp_3",
    name: "Gulf Care Specialist Hospital",
    country: GCC_COUNTRIES.QATAR,
    city: "Doha",
    departments: ["Oncology", "Surgery", "Dermatology"],
  }
];

export const MOCK_ROLES = [
  {
    id: "role_1",
    hospitalId: "hosp_1",
    title: "Consultant Cardiologist",
    department: "Cardiology",
    country: GCC_COUNTRIES.UAE,
    status: ROLE_STATUS.ACTIVE,
    urgency: "HIGH",
    requiredSpecialty: "Cardiology",
    minExperience: 5,
  },
  {
    id: "role_2",
    hospitalId: "hosp_2",
    title: "Specialist Pediatrician",
    department: "Pediatrics",
    country: GCC_COUNTRIES.SAUDI_ARABIA,
    status: ROLE_STATUS.INTERVIEWING,
    urgency: "MEDIUM",
    requiredSpecialty: "Pediatrics",
    minExperience: 3,
  }
];

export const MOCK_CANDIDATES = [
  {
    id: "cand_1",
    firstName: "Ahmed",
    lastName: "Hassan",
    specialty: "Cardiology",
    grade: "Consultant",
    currentCountry: "UK",
    readiness: READINESS_LABEL.READY_NOW,
    status: APPLICATION_STATUS.SCREENING,
  },
  {
    id: "cand_2",
    firstName: "Sara",
    lastName: "Ali",
    specialty: "Pediatrics",
    grade: "Specialist",
    currentCountry: "Egypt",
    readiness: READINESS_LABEL.NEAR_READY,
    status: APPLICATION_STATUS.NEW,
  }
];
