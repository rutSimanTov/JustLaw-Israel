import React from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Input } from "../../components/UI/Input/input"
import { Button } from "../../components/UI/Button/button"

const connectionOptions = [
  "Networking",
  "Mentorship",
  "Partnership",
  "Investment",
  "Collaboration",
  "Knowledge sharing",
]

const engagementOptions = [
  "Virtual meetings",
  "In person meetings",
  "Email correspondence",
  "Project collaboration",
  "Advisory role",
  "Speaking engagements",
]

type FormValues = {
  connectionTypes: string[]
  engagementTypes: string[]
  contactInfo: {
    phone?: string
    linkedInUrl?: string
    websiteUrl?: string
    other?: string
  }
  isVisible: boolean
}

const schema: yup.ObjectSchema<FormValues> = yup.object({
  connectionTypes: yup
    .array()
    .of(yup.string().required())
    .min(1, "Please select at least one option")
    .required(),
  engagementTypes: yup
    .array()
    .of(yup.string().required())
    .min(1, "Please select at least one option")
    .required(),
  contactInfo: yup.object({
    phone: yup.string().optional(),
    linkedInUrl: yup.string().url("Must be a valid URL").optional(),
    websiteUrl: yup.string().url("Must be a valid URL").optional(),
    other: yup.string().optional(),
  }),
  isVisible: yup.boolean().required(),
})

const Step3_TheConnectionYouAreSeeking: React.FC<{
  nextStep: () => void
  prevStep: () => void
  handleDataChange: (data: FormValues) => void
  initialData: Partial<FormValues>
}> = ({ nextStep, prevStep, handleDataChange, initialData }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      connectionTypes: initialData.connectionTypes ?? [],
      engagementTypes: initialData.engagementTypes ?? [],
      contactInfo: {
        phone: initialData.contactInfo?.phone ?? "",
        linkedInUrl: initialData.contactInfo?.linkedInUrl ?? "",
        websiteUrl: initialData.contactInfo?.websiteUrl ?? "",
        other: initialData.contactInfo?.other ?? "",
      },
      isVisible: initialData.isVisible ?? false,
    },
  })

  React.useEffect(() => {
    reset({
      connectionTypes: initialData.connectionTypes ?? [],
      engagementTypes: initialData.engagementTypes ?? [],
      contactInfo: {
        phone: initialData.contactInfo?.phone ?? "",
        linkedInUrl: initialData.contactInfo?.linkedInUrl ?? "",
        websiteUrl: initialData.contactInfo?.websiteUrl ?? "",
        other: initialData.contactInfo?.other ?? "",
      },
      isVisible: initialData.isVisible ?? false,
    })
  }, [initialData, reset])

  const onSubmit = (data: FormValues) => {
    handleDataChange(data)
    nextStep()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container bg-card text-card-foreground rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in text-left"
      dir="rtl"
    >
      <h2 className="text-3xl font-oswald text-primary text-center font-bold">
        The connection you are seeking
      </h2>

      {/* Connection Types */}
      <div>
        <label className="text-pink-600 font-semibold block mb-2">
          Connection Types <span className="text-red-600">*</span>
        </label>
        <Controller
          control={control}
          name="connectionTypes"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-1">
              {connectionOptions.map((option) => (
                <label
                  key={option}
                  className="flex flex-row-reverse items-center gap-2 cursor-pointer text-pink-700"

                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={field.value.includes(option)}
                    onChange={() => {
                      if (field.value.includes(option)) {
                        field.onChange(field.value.filter((v) => v !== option))
                      } else {
                        field.onChange([...field.value, option])
                      }
                    }}
                    className="accent-pink-600"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        />
        {errors.connectionTypes && (
          <p className="text-red-500 text-sm mt-1">{errors.connectionTypes.message}</p>
        )}
      </div>

      {/* Engagement Types */}
      <div>
        <label className="text-pink-600 font-semibold block mb-2">
          Engagement Types <span className="text-red-600">*</span>
        </label>
        <Controller
          control={control}
          name="engagementTypes"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-1">
              {engagementOptions.map((option) => (
                <label
                  key={option}
                  className="flex flex-row-reverse items-center gap-2 cursor-pointer text-pink-700"
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={field.value.includes(option)}
                    onChange={() => {
                      if (field.value.includes(option)) {
                        field.onChange(field.value.filter((v) => v !== option))
                      } else {
                        field.onChange([...field.value, option])
                      }
                    }}
                    className="accent-pink-600"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        />
        {errors.engagementTypes && (
          <p className="text-red-500 text-sm mt-1">{errors.engagementTypes.message}</p>
        )}
      </div>

      {/* Contact Info */}
      <div className="space-y-3">
        <div>
          <label htmlFor="phone" className="font-medium text-lg block">
            Phone
          </label>
          <Input
            {...register("contactInfo.phone")}
            placeholder="Enter phone number"
          className="text-left text-white"
          />
        </div>

        <div>
          <label htmlFor="linkedInUrl" className="font-medium text-lg block">
            LinkedIn URL
          </label>
          <Input
            {...register("contactInfo.linkedInUrl")}
            placeholder="Enter LinkedIn profile URL"
          className="text-left text-white"
          />
          {errors.contactInfo?.linkedInUrl && (
            <p className="text-red-500 text-sm">{errors.contactInfo.linkedInUrl.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="websiteUrl" className="font-medium text-lg block">
            Website URL
          </label>
          <Input
            {...register("contactInfo.websiteUrl")}
            placeholder="Enter your website"
          className="text-left text-white"
          />
          {errors.contactInfo?.websiteUrl && (
            <p className="text-red-500 text-sm">{errors.contactInfo.websiteUrl.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="other" className="font-medium text-lg block">
            Other Contact
          </label>
          <Input
            {...register("contactInfo.other")}
            placeholder="Other contact method"
          className="text-left text-white"
          />
        </div>
      </div>

      {/* Public Profile Toggle */}
      <div className="flex items-center gap-3 mt-6">
        <input
          type="checkbox"
          id="isVisible"
          {...register("isVisible")}
          className="relative w-12 h-6 rounded-full appearance-none bg-gray-300 cursor-pointer checked:bg-pink-600 transition-colors duration-300"
        />
        <label htmlFor="isVisible" className="text-pink-600 font-semibold cursor-pointer">
          Display my profile publicly
        </label>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button type="submit" variant="default" size="lg">

          Next
        </Button>
        <Button type="button" variant="outline" onClick={prevStep} size="lg">

           ← Back
         
        </Button>
      </div>
    </form>
  )
}

export default Step3_TheConnectionYouAreSeeking
