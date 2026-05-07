import { PrismaClient, UserRole, Gender, LanguageProficiency, OpportunityStatus, ApplicationStatus, ReadinessLabel, EmploymentType, InterviewType, DocumentType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Users
  console.log('Creating Test users...');
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@medicallinks.local' },
    update: { passwordHash },
    create: {
      email: 'admin@medicallinks.local',
      passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      role: UserRole.ADMIN,
    },
  });


  const hospitalPartnerUser = await prisma.user.upsert({
    where: { email: 'hospital@medicallinks.local' },
    update: { passwordHash },
    create: {
      email: 'hospital@medicallinks.local',
      passwordHash,
      firstName: 'Hospital',
      lastName: 'Partner',
      role: UserRole.HOSPITAL_CONTACT,
    },
  });

  const applicant1 = await prisma.user.upsert({
    where: { email: 'applicant@medicallinks.local' },
    update: { passwordHash },
    create: {
      email: 'applicant@medicallinks.local',
      passwordHash,
      firstName: 'Ahmed',
      lastName: 'Hassan',
      role: UserRole.APPLICANT,
      applicantProfile: {
        create: {
          gender: Gender.MALE,
          nationality: 'Egypt',
          countryOfResidence: 'United Kingdom',
          currentCity: 'London',
          professionalSummary: 'Experienced Cardiologist looking for opportunities in the GCC.',
          totalYearsExperience: 8,
          postSpecialtyExp: 3,
          readinessLabel: ReadinessLabel.READY_NOW,
          languages: {
            create: [
              { language: 'Arabic', proficiency: LanguageProficiency.NATIVE },
              { language: 'English', proficiency: LanguageProficiency.FLUENT }
            ]
          },
          educations: {
            create: [
              { degree: 'MBBS', institution: 'Cairo University', country: 'Egypt', graduationDate: new Date('2015-06-01') }
            ]
          },
          workExperiences: {
            create: [
              { title: 'Specialist Cardiologist', hospitalName: 'London General', country: 'UK', city: 'London', startDate: new Date('2020-01-01'), isCurrent: true }
            ]
          },
          medicalLicenses: {
            create: [
              { issuingAuthority: 'GMC', country: 'UK', status: 'Active', issueDate: new Date('2016-01-01') }
            ]
          },
          preferences: {
            create: {
              preferredCountries: ['Saudi Arabia', 'United Arab Emirates'],
              relocationWilling: true,
              visibility: 'VISIBLE'
            }
          }
        }
      }
    },
  });

  console.log('Test users created. Credentials:');
  console.log('--------------------------------');
  console.log('Applicant: applicant@medicallinks.local / Password123!');
  console.log('Admin: admin@medicallinks.local / Password123!');
  console.log('Hospital: hospital@medicallinks.local / Password123!');
  console.log('--------------------------------');

  // Skip recreating hospitals and opportunities if they exist
  const hospitalCount = await prisma.hospitalOrganization.count();
  if (hospitalCount === 0) {
    console.log('Creating Hospitals & Opportunities...');
    const hospital1 = await prisma.hospitalOrganization.create({
      data: {
        name: 'Al Noor Medical City',
        description: 'A leading tertiary care hospital in Abu Dhabi, delivering world-class healthcare.',
        website: 'https://example.com/alnoor',
        status: 'ACTIVE',
        type: 'Private Hospital',
        country: 'United Arab Emirates',
        city: 'Abu Dhabi',
        agreementStartDate: new Date('2024-01-01'),
        agreementEndDate: new Date('2025-12-31'),
        locations: {
          create: [
            { country: 'United Arab Emirates', city: 'Abu Dhabi', address: 'Yas Island', isPrimary: true }
          ]
        },
        departments: {
          create: [
            { name: 'Anesthesiology', description: 'Level I Trauma Center' },
            { name: 'Pediatrics', description: 'Advanced Pediatric ICU' }
          ]
        },
        contacts: {
          create: [
            {
              userId: hospitalPartnerUser.id,
              jobTitle: 'Hospital Administrator',
              isPrimary: true,
            }
          ]
        }
      },
      include: { departments: true }
    });

    const opp1 = await prisma.opportunity.create({
      data: {
        hospitalId: hospital1.id,
        departmentId: hospital1.departments.find(d => d.name === 'Anesthesiology')?.id,
        title: 'Consultant Anesthesiologist',
        specialty: 'Anesthesiology',
        country: 'United Arab Emirates',
        city: 'Abu Dhabi',
        employmentType: EmploymentType.FULL_TIME,
        minYearsExperience: 5,
        salaryRangeMin: 60000,
        salaryRangeMax: 85000,
        currency: 'AED',
        description: 'Seeking a highly skilled Consultant Anesthesiologist to join our multidisciplinary team.',
        licensingRequirement: 'Eligible for DHA/DOH/SCFHS or equivalent GCC licensing pathway.',
        status: OpportunityStatus.ACTIVE,
      }
    });
  } else {
    // Ensure the hospital contact link exists even on re-seed
    const firstHospital = await prisma.hospitalOrganization.findFirst({ orderBy: { createdAt: 'asc' } });
    if (firstHospital) {
      await prisma.hospitalContact.upsert({
        where: { userId: hospitalPartnerUser.id },
        update: { hospitalId: firstHospital.id },
        create: { userId: hospitalPartnerUser.id, hospitalId: firstHospital.id, jobTitle: 'Hospital Administrator', isPrimary: true },
      });
      await prisma.hospitalOrganization.update({
        where: { id: firstHospital.id },
        data: { status: 'ACTIVE' }
      });
      console.log('Created Hospital: Al Noor Medical City and linked Hospital user.');
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
