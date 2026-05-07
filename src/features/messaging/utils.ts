export function formatParticipantName(user: any) {
  if (!user) return "Unknown User";

  if (user.role === "HOSPITAL_CONTACT" && user.hospitalContact?.hospital?.name) {
    return `${user.firstName} ${user.lastName} (${user.hospitalContact.hospital.name})`;
  }

  if (user.role === "APPLICANT") {
    const visibility = user.applicantProfile?.preferences?.visibility;
    const hideContactDetails = user.applicantProfile?.preferences?.hideContactDetails;

    if (visibility === "ANONYMOUS") {
      return "Anonymous Candidate";
    }

    if (hideContactDetails) {
      return `${user.firstName} ${user.lastName ? user.lastName[0] + "." : ""}`;
    }
  }

  return `${user.firstName} ${user.lastName}`;
}
