/**
 * One-off fix: link the seeded hospital user to the seeded hospital org
 * and ensure the hospital status is ACTIVE.
 *
 * Run with:  npx tsx prisma/fix-hospital-contact.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Find the hospital user
  const hospitalUser = await prisma.user.findUnique({
    where: { email: "hospital@medicallinks.local" },
  });
  if (!hospitalUser) throw new Error("Hospital user not found — run seed first.");

  // 2. Find the hospital org (first one, Al Noor Medical City)
  let hospital = await prisma.hospitalOrganization.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!hospital) {
    // Create it if seed didn't run the hospital block
    hospital = await prisma.hospitalOrganization.create({
      data: {
        name: "Al Noor Medical City",
        description: "A leading tertiary care hospital in Abu Dhabi.",
        website: "https://example.com/alnoor",
        type: "Private Hospital",
        country: "United Arab Emirates",
        city: "Abu Dhabi",
        status: "ACTIVE",
        agreementStartDate: new Date("2024-01-01"),
        agreementEndDate: new Date("2025-12-31"),
      },
    });
    console.log(`✅ Created hospital: ${hospital.name}`);
  }

  // 3. Ensure status is ACTIVE
  if (hospital.status !== "ACTIVE") {
    await prisma.hospitalOrganization.update({
      where: { id: hospital.id },
      data: { status: "ACTIVE" },
    });
    console.log(`✅ Set hospital status to ACTIVE`);
  } else {
    console.log(`ℹ️  Hospital already ACTIVE`);
  }

  // 4. Upsert the HospitalContact link
  await prisma.hospitalContact.upsert({
    where: { userId: hospitalUser.id },
    update: { hospitalId: hospital.id, jobTitle: "Hospital Administrator", isPrimary: true },
    create: {
      userId: hospitalUser.id,
      hospitalId: hospital.id,
      jobTitle: "Hospital Administrator",
      isPrimary: true,
    },
  });
  console.log(`✅ Linked ${hospitalUser.email} → ${hospital.name}`);
  console.log(`\nDone! Log in with hospital@medicallinks.local / Password123!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
