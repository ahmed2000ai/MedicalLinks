import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface Step {
  id: string
  title: string
  description?: string
}

export interface ProgressStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[]
  currentStep: number // 0-indexed
}

export function ProgressStepper({ steps, currentStep, className, ...props }: ProgressStepperProps) {
  return (
    <div className={cn("flex flex-col md:flex-row gap-4", className)} {...props}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep

        return (
          <div key={step.id} className="flex-1 relative">
            {/* Desktop connecting line */}
            {index < steps.length - 1 && (
              <div className={cn(
                "hidden md:block absolute top-4 left-[50%] w-full h-[2px] transition-colors duration-300",
                index < currentStep ? "bg-primary" : "bg-muted"
              )} />
            )}
            
            <div className="relative flex flex-row md:flex-col items-center md:justify-center gap-4 md:gap-2">
              <div
                className={cn(
                  "z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-300",
                  isCompleted 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : isCurrent 
                      ? "border-primary text-primary bg-background" 
                      : "border-muted text-muted-foreground bg-background"
                )}
              >
                {isCompleted ? <Check size={16} /> : index + 1}
              </div>
              
              <div className="flex flex-col md:items-center text-left md:text-center mt-1">
                <span className={cn(
                  "text-sm font-semibold",
                  isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
                {step.description && (
                  <span className="text-xs text-muted-foreground hidden md:block mt-1 max-w-[120px] text-center">
                    {step.description}
                  </span>
                )}
              </div>
            </div>
            
            {/* Mobile connecting line */}
            {index < steps.length - 1 && (
              <div className={cn(
                "md:hidden absolute top-8 left-4 w-[2px] h-[calc(100%-2rem)] transition-colors duration-300",
                index < currentStep ? "bg-primary" : "bg-muted"
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}
