"use client"

import React from "react"
import { useFormContext, useFieldArray } from "react-hook-form"
import { ProfileBuilderInput } from "../../schemas"
import { FormSection, FormField, RepeatableEntry } from "@/components/ui/form-section"
import { Input } from "@/components/ui/input"

export function ProfessionalActivitiesTab() {
  const { control, register, formState: { errors } } = useFormContext<ProfileBuilderInput>()

  const { fields: procFields, append: appendProc, remove: removeProc } = useFieldArray({ control, name: "clinicalProcedures", keyName: "rhfId" })
  const { fields: courseFields, append: appendCourse, remove: removeCourse } = useFieldArray({ control, name: "trainingCourses", keyName: "rhfId" })
  const { fields: pubFields, append: appendPub, remove: removePub } = useFieldArray({ control, name: "publications", keyName: "rhfId" })
  const { fields: presFields, append: appendPres, remove: removePres } = useFieldArray({ control, name: "presentations", keyName: "rhfId" })
  const { fields: teachFields, append: appendTeach, remove: removeTeach } = useFieldArray({ control, name: "teachingRoles", keyName: "rhfId" })
  const { fields: qiFields, append: appendQi, remove: removeQi } = useFieldArray({ control, name: "qiProjects", keyName: "rhfId" })
  const { fields: leadFields, append: appendLead, remove: removeLead } = useFieldArray({ control, name: "leadershipRoles", keyName: "rhfId" })
  const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({ control, name: "awards", keyName: "rhfId" })
  const { fields: memFields, append: appendMem, remove: removeMem } = useFieldArray({ control, name: "memberships", keyName: "rhfId" })
  const { fields: refFields, append: appendRef, remove: removeRef } = useFieldArray({ control, name: "referees", keyName: "rhfId" })

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Professional Activities (Optional)</h2>
        <p className="text-muted-foreground mt-1">
          Strengthen your profile by adding your clinical procedures, publications, teaching experience, and more. 
          <strong> All sections on this page are completely optional.</strong> Feel free to skip them if they don't apply.
        </p>
      </div>

      <FormSection title="Clinical Procedures & Competencies" description="Add specific procedures you are competent in.">
        <RepeatableEntry
          title="Procedures" addLabel="Add Procedure" emptyLabel="No procedures added."
          onAdd={() => appendProc({ procedureName: "", category: "", experienceLevel: "", volume: null, notes: "" })} onRemove={removeProc}
          items={procFields.map((field, index) => (
            <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Procedure Name" htmlFor={`proc-${index}-name`} required error={errors.clinicalProcedures?.[index]?.procedureName?.message}>
                <Input id={`proc-${index}-name`} {...register(`clinicalProcedures.${index}.procedureName` as const)} />
              </FormField>
              <FormField label="Experience Level" htmlFor={`proc-${index}-lvl`} error={errors.clinicalProcedures?.[index]?.experienceLevel?.message}>
                <Input id={`proc-${index}-lvl`} placeholder="e.g. Independent, Supervised" {...register(`clinicalProcedures.${index}.experienceLevel` as const)} />
              </FormField>
              <FormField label="Volume (Cases)" htmlFor={`proc-${index}-vol`} error={errors.clinicalProcedures?.[index]?.volume?.message}>
                <Input id={`proc-${index}-vol`} type="number" {...register(`clinicalProcedures.${index}.volume` as const, { valueAsNumber: true })} />
              </FormField>
            </div>
          ))}
        />
      </FormSection>

      <FormSection title="Publications" description="List your published research and articles.">
        <RepeatableEntry
          title="Publications" addLabel="Add Publication" emptyLabel="No publications added."
          onAdd={() => appendPub({ title: "", authors: "", journal: "", year: null, doi: "" })} onRemove={removePub}
          items={pubFields.map((field, index) => (
            <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Title" htmlFor={`pub-${index}-title`} required error={errors.publications?.[index]?.title?.message}>
                <Input id={`pub-${index}-title`} {...register(`publications.${index}.title` as const)} />
              </FormField>
              <FormField label="Journal" htmlFor={`pub-${index}-journal`} error={errors.publications?.[index]?.journal?.message}>
                <Input id={`pub-${index}-journal`} {...register(`publications.${index}.journal` as const)} />
              </FormField>
              <FormField label="Year" htmlFor={`pub-${index}-year`} error={errors.publications?.[index]?.year?.message}>
                <Input id={`pub-${index}-year`} type="number" {...register(`publications.${index}.year` as const, { valueAsNumber: true })} />
              </FormField>
              <FormField label="DOI / Link" htmlFor={`pub-${index}-doi`} error={errors.publications?.[index]?.doi?.message}>
                <Input id={`pub-${index}-doi`} {...register(`publications.${index}.doi` as const)} />
              </FormField>
            </div>
          ))}
        />
      </FormSection>

      <FormSection title="Quality Improvement & Audits" description="Clinical audits and QI projects (highly valued in GCC/UK).">
        <RepeatableEntry
          title="Audits & QI" addLabel="Add Audit/QI" emptyLabel="No audits added."
          onAdd={() => appendQi({ projectTitle: "", institution: "", year: null, role: "", outcome: "" })} onRemove={removeQi}
          items={qiFields.map((field, index) => (
            <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Project Title" htmlFor={`qi-${index}-title`} required error={errors.qiProjects?.[index]?.projectTitle?.message}>
                <Input id={`qi-${index}-title`} {...register(`qiProjects.${index}.projectTitle` as const)} />
              </FormField>
              <FormField label="Institution" htmlFor={`qi-${index}-inst`} error={errors.qiProjects?.[index]?.institution?.message}>
                <Input id={`qi-${index}-inst`} {...register(`qiProjects.${index}.institution` as const)} />
              </FormField>
              <FormField label="Outcome / Impact" htmlFor={`qi-${index}-out`} error={errors.qiProjects?.[index]?.outcome?.message}>
                <Input id={`qi-${index}-out`} {...register(`qiProjects.${index}.outcome` as const)} />
              </FormField>
              <FormField label="Year" htmlFor={`qi-${index}-year`} error={errors.qiProjects?.[index]?.year?.message}>
                <Input id={`qi-${index}-year`} type="number" {...register(`qiProjects.${index}.year` as const, { valueAsNumber: true })} />
              </FormField>
            </div>
          ))}
        />
      </FormSection>

      <FormSection title="Courses & Workshops" description="Additional training programs and certifications.">
        <RepeatableEntry
          title="Courses" addLabel="Add Course" emptyLabel="No courses added."
          onAdd={() => appendCourse({ title: "", provider: "", location: "", startDate: undefined, certificateReceived: false })} onRemove={removeCourse}
          items={courseFields.map((field, index) => (
            <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Course Title" htmlFor={`crs-${index}-title`} required error={errors.trainingCourses?.[index]?.title?.message}>
                <Input id={`crs-${index}-title`} {...register(`trainingCourses.${index}.title` as const)} />
              </FormField>
              <FormField label="Provider" htmlFor={`crs-${index}-prov`} error={errors.trainingCourses?.[index]?.provider?.message}>
                <Input id={`crs-${index}-prov`} {...register(`trainingCourses.${index}.provider` as const)} />
              </FormField>
              <FormField label="Date" htmlFor={`crs-${index}-date`} error={errors.trainingCourses?.[index]?.startDate?.message}>
                <Input id={`crs-${index}-date`} type="date" {...register(`trainingCourses.${index}.startDate` as const)} />
              </FormField>
            </div>
          ))}
        />
      </FormSection>

      <FormSection title="Presentations" description="Conference presentations and speaking engagements.">
        <RepeatableEntry
          title="Presentations" addLabel="Add Presentation" emptyLabel="No presentations added."
          onAdd={() => appendPres({ title: "", conferenceName: "", year: null })} onRemove={removePres}
          items={presFields.map((field, index) => (
            <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Title" htmlFor={`prs-${index}-title`} required error={errors.presentations?.[index]?.title?.message}>
                <Input id={`prs-${index}-title`} {...register(`presentations.${index}.title` as const)} />
              </FormField>
              <FormField label="Conference" htmlFor={`prs-${index}-conf`} error={errors.presentations?.[index]?.conferenceName?.message}>
                <Input id={`prs-${index}-conf`} {...register(`presentations.${index}.conferenceName` as const)} />
              </FormField>
              <FormField label="Year" htmlFor={`prs-${index}-year`} error={errors.presentations?.[index]?.year?.message}>
                <Input id={`prs-${index}-year`} type="number" {...register(`presentations.${index}.year` as const, { valueAsNumber: true })} />
              </FormField>
            </div>
          ))}
        />
      </FormSection>

      <FormSection title="Teaching Experience" description="Clinical or academic teaching roles.">
        <RepeatableEntry
          title="Teaching" addLabel="Add Teaching Role" emptyLabel="No teaching roles added."
          onAdd={() => appendTeach({ roleTitle: "", institution: "", audienceType: "" })} onRemove={removeTeach}
          items={teachFields.map((field, index) => (
            <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Role / Title" htmlFor={`tch-${index}-role`} required error={errors.teachingRoles?.[index]?.roleTitle?.message}>
                <Input id={`tch-${index}-role`} {...register(`teachingRoles.${index}.roleTitle` as const)} />
              </FormField>
              <FormField label="Institution" htmlFor={`tch-${index}-inst`} error={errors.teachingRoles?.[index]?.institution?.message}>
                <Input id={`tch-${index}-inst`} {...register(`teachingRoles.${index}.institution` as const)} />
              </FormField>
              <FormField label="Audience" htmlFor={`tch-${index}-aud`} error={errors.teachingRoles?.[index]?.audienceType?.message}>
                <Input id={`tch-${index}-aud`} placeholder="e.g. Medical Students" {...register(`teachingRoles.${index}.audienceType` as const)} />
              </FormField>
            </div>
          ))}
        />
      </FormSection>

      <FormSection title="Leadership & Committees" description="Administrative and leadership positions.">
        <RepeatableEntry
          title="Leadership" addLabel="Add Role" emptyLabel="No leadership roles added."
          onAdd={() => appendLead({ roleTitle: "", organization: "", startDate: undefined })} onRemove={removeLead}
          items={leadFields.map((field, index) => (
            <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Role" htmlFor={`ld-${index}-role`} required error={errors.leadershipRoles?.[index]?.roleTitle?.message}>
                <Input id={`ld-${index}-role`} {...register(`leadershipRoles.${index}.roleTitle` as const)} />
              </FormField>
              <FormField label="Organization" htmlFor={`ld-${index}-org`} error={errors.leadershipRoles?.[index]?.organization?.message}>
                <Input id={`ld-${index}-org`} {...register(`leadershipRoles.${index}.organization` as const)} />
              </FormField>
              <FormField label="Start Date" htmlFor={`ld-${index}-start`} error={errors.leadershipRoles?.[index]?.startDate?.message}>
                <Input id={`ld-${index}-start`} type="date" {...register(`leadershipRoles.${index}.startDate` as const)} />
              </FormField>
            </div>
          ))}
        />
      </FormSection>

      <FormSection title="Awards & Honors" description="Recognitions and scholarships.">
        <RepeatableEntry
          title="Awards" addLabel="Add Award" emptyLabel="No awards added."
          onAdd={() => appendAward({ title: "", awardingOrganization: "", year: null })} onRemove={removeAward}
          items={awardFields.map((field, index) => (
            <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Award Title" htmlFor={`aw-${index}-title`} required error={errors.awards?.[index]?.title?.message}>
                <Input id={`aw-${index}-title`} {...register(`awards.${index}.title` as const)} />
              </FormField>
              <FormField label="Organization" htmlFor={`aw-${index}-org`} error={errors.awards?.[index]?.awardingOrganization?.message}>
                <Input id={`aw-${index}-org`} {...register(`awards.${index}.awardingOrganization` as const)} />
              </FormField>
              <FormField label="Year" htmlFor={`aw-${index}-year`} error={errors.awards?.[index]?.year?.message}>
                <Input id={`aw-${index}-year`} type="number" {...register(`awards.${index}.year` as const, { valueAsNumber: true })} />
              </FormField>
            </div>
          ))}
        />
      </FormSection>

      <FormSection title="Professional Memberships" description="Royal colleges, specialist societies, etc.">
        <RepeatableEntry
          title="Memberships" addLabel="Add Membership" emptyLabel="No memberships added."
          onAdd={() => appendMem({ organization: "", membershipType: "", startDate: undefined })} onRemove={removeMem}
          items={memFields.map((field, index) => (
            <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Organization" htmlFor={`mem-${index}-org`} required error={errors.memberships?.[index]?.organization?.message}>
                <Input id={`mem-${index}-org`} {...register(`memberships.${index}.organization` as const)} />
              </FormField>
              <FormField label="Type" htmlFor={`mem-${index}-type`} error={errors.memberships?.[index]?.membershipType?.message}>
                <Input id={`mem-${index}-type`} placeholder="e.g. Fellow, Member" {...register(`memberships.${index}.membershipType` as const)} />
              </FormField>
              <FormField label="Start Date" htmlFor={`mem-${index}-start`} error={errors.memberships?.[index]?.startDate?.message}>
                <Input id={`mem-${index}-start`} type="date" {...register(`memberships.${index}.startDate` as const)} />
              </FormField>
            </div>
          ))}
        />
      </FormSection>

      <FormSection title="Referees (Private)" description="Provide references. These are strictly private and NOT shared with hospitals without your explicit permission.">
        <RepeatableEntry
          title="Referees" addLabel="Add Referee" emptyLabel="No referees added."
          onAdd={() => appendRef({ fullName: "", title: "", relationship: "", email: "", phone: "" })} onRemove={removeRef}
          items={refFields.map((field, index) => (
            <div key={field.rhfId} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Full Name" htmlFor={`ref-${index}-name`} required error={errors.referees?.[index]?.fullName?.message}>
                <Input id={`ref-${index}-name`} {...register(`referees.${index}.fullName` as const)} />
              </FormField>
              <FormField label="Title / Position" htmlFor={`ref-${index}-title`} error={errors.referees?.[index]?.title?.message}>
                <Input id={`ref-${index}-title`} {...register(`referees.${index}.title` as const)} />
              </FormField>
              <FormField label="Relationship" htmlFor={`ref-${index}-rel`} error={errors.referees?.[index]?.relationship?.message}>
                <Input id={`ref-${index}-rel`} placeholder="e.g. Clinical Supervisor" {...register(`referees.${index}.relationship` as const)} />
              </FormField>
              <FormField label="Email" htmlFor={`ref-${index}-email`} error={errors.referees?.[index]?.email?.message}>
                <Input id={`ref-${index}-email`} type="email" {...register(`referees.${index}.email` as const)} />
              </FormField>
              <FormField label="Phone" htmlFor={`ref-${index}-phone`} error={errors.referees?.[index]?.phone?.message}>
                <Input id={`ref-${index}-phone`} {...register(`referees.${index}.phone` as const)} />
              </FormField>
            </div>
          ))}
        />
      </FormSection>

    </div>
  )
}
