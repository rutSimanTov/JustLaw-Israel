import React from "react"
import { Input } from "../../components/UI/Input/input"
import { useForm, useFieldArray } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { X } from "lucide-react"
import { Button } from "../../components/UI/Button/button"

type FormValues = {
  role_description: string
  countryRegion: string
  valueSentence: string
  keywords: { value: string }[]
  currentChallenge: string
}

const schema = yup.object({
  role_description: yup.string().required("Role description is required"),
  countryRegion: yup.string().required("Country / region is required"),
  valueSentence: yup.string().required("Value sentence is required"),
  currentChallenge: yup.string().required("Current challenge is required"),
  keywords: yup
    .array()
    .of(yup.object({ value: yup.string().required("Keyword is required") }))
    .min(1, "At least one keyword is required")
    .max(3, "You can enter up to 3 keywords")
    .required(),
})

type Step2Props = {
  nextStep: () => void
  prevStep: () => void
  handleDataChange: (data: {
    role_description: string
    countryRegion: string
    valueSentence: string
    keywords: string[]
    currentChallenge: string
  }) => void
  initialData: {
    role_description?: string
    countryRegion?: string
    valueSentence?: string
    keywords?: string[]
    currentChallenge?: string
  }
  editingFromReview?: number | null
  setStep?: (step: number) => void
  setEditingFromReview?: (val: number | null) => void
}

const Step2_TheValueYouBring: React.FC<Step2Props> = ({
  nextStep,
  prevStep,
  handleDataChange,
  initialData,
  editingFromReview,
  setStep,
  setEditingFromReview,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      role_description: initialData.role_description ?? "",
      countryRegion: initialData.countryRegion ?? "",
      valueSentence: initialData.valueSentence ?? "",
      currentChallenge: initialData.currentChallenge ?? "",
      keywords:
        initialData.keywords && initialData.keywords.length > 0
          ? initialData.keywords.map((k) => ({ value: k }))
          : [{ value: "" }],
    },
  })

  React.useEffect(() => {
    reset({
      role_description: initialData.role_description ?? "",
      countryRegion: initialData.countryRegion ?? "",
      valueSentence: initialData.valueSentence ?? "",
      currentChallenge: initialData.currentChallenge ?? "",
      keywords:
        initialData.keywords && initialData.keywords.length > 0
          ? initialData.keywords.map((k) => ({ value: k }))
          : [{ value: "" }],
    })
  }, [initialData, reset])

  const { fields, append, remove } = useFieldArray({
    name: "keywords",
    control,
  })

  const keywords = watch("keywords")
  const canAddMore =
    fields.length < 3 && keywords.every((k) => k.value.trim().length > 0)

  const onSubmit = (data: FormValues) => {
    handleDataChange({
      role_description: data.role_description,
      countryRegion: data.countryRegion,
      valueSentence: data.valueSentence,
      currentChallenge: data.currentChallenge,
      keywords: data.keywords.map((k) => k.value.trim()),
    })

    if (editingFromReview && setEditingFromReview) {
      setEditingFromReview(null)
    }

    nextStep()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container bg-card text-card-foreground rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in"
      dir="rtl"
    >
      <h2 className="text-3xl font-oswald text-primary text-center font-bold">
        The value you bring
      </h2>

      {/* Role Description */}
      <div className="flex flex-col space-y-1 text-left">
        <label htmlFor="roleDescription" className="font-medium text-lg text-foreground text-left">
          Role Description <span className="text-red-600">*</span>
        </label>
        <Input
          {...register("role_description", {
            onChange: (e) => {
              const currentData = {
                role_description: e.target.value,
                countryRegion: initialData.countryRegion || "",
                valueSentence: initialData.valueSentence || "",
                currentChallenge: initialData.currentChallenge || "",
                keywords: initialData.keywords || [],
              }
              handleDataChange(currentData)
            }
          })}
          type="text"
          id="roleDescription"
          placeholder="Enter your role description"
          className="text-left text-white"
        />
        {errors.role_description && (
          <p className="text-red-500 text-sm mt-1">{errors.role_description.message}</p>
        )}
      </div>

      {/* Country / Region */}
      <div className="flex flex-col space-y-1 text-left">
        <label htmlFor="countryRegion" className="font-medium text-lg text-foreground text-left">
          Country / Region <span className="text-red-600">*</span>
        </label>
        <Input
          {...register("countryRegion", {
            onChange: (e) => {
              const currentData = {
                role_description: initialData.role_description || "",
                countryRegion: e.target.value,
                valueSentence: initialData.valueSentence || "",
                currentChallenge: initialData.currentChallenge || "",
                keywords: initialData.keywords || [],
              }
              handleDataChange(currentData)
            }
          })}
          type="text"
          id="countryRegion"
          placeholder="Enter your country or region"
          className="text-left text-white"
        />
        {errors.countryRegion && (
          <p className="text-red-600 text-sm mt-1">{errors.countryRegion.message}</p>
        )}
      </div>

      {/* Value Sentence */}
      <div className="flex flex-col space-y-1 text-left">
        <label htmlFor="valueSentence" className="font-medium text-lg text-foreground text-left">
          Value Sentence <span className="text-red-600">*</span>
        </label>
        <Input
          {...register("valueSentence")}
          type="text"
          id="valueSentence"
          placeholder="Enter your value sentence"
          className="text-left text-white"
        />
        {errors.valueSentence && (
          <p className="text-red-600 text-sm mt-1">{errors.valueSentence.message}</p>
        )}
      </div>

      {/* Current Challenge */}
      <div className="flex flex-col space-y-1 text-left">
        <label htmlFor="currentChallenge" className="font-medium text-lg text-foreground text-left">
          Current Challenge <span className="text-red-600">*</span>
        </label>
        <Input
          {...register("currentChallenge")}
          type="text"
          id="currentChallenge"
          placeholder="Enter your current challenge"
          className="text-left text-white"
        />
        {errors.currentChallenge && (
          <p className="text-red-600 text-sm mt-1">{errors.currentChallenge.message}</p>
        )}
      </div>

      {/* Keywords */}
      <div className="flex flex-col space-y-2 text-left">
        <label className="font-medium text-lg text-foreground text-left">
          Keywords (max 3) <span className="text-red-600">*</span>
        </label>

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              {...register(`keywords.${index}.value` as const)}
              type="text"
              placeholder="Enter a keyword"
           className="text-left text-white"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              title="Remove"
              className="text-red-500 hover:text-red-700 p-0"
            >
              <X size={20} />
            </Button>
          </div>
        ))}

        {typeof errors.keywords?.message === "string" && (
          <p className="text-red-600 text-sm mt-1">{errors.keywords.message}</p>
        )}

        {canAddMore && (
          <Button
            type="button"
            variant="link"
            size="default"
            onClick={() => append({ value: "" })}
            className="text-sky-600 text-sm underline hover:text-sky-800 transition p-0"
          >
            + Add keyword
          </Button>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-row-reverse justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          size="lg"
          className="px-6 py-2 rounded-xl"
        >
          ← Back
        </Button>
        <Button
          type="submit"
          variant="default"
          size="lg"
          className="px-6 py-2 rounded-xl"
        >
          Next
        </Button>
      </div>
    </form>
  )
}

export default Step2_TheValueYouBring
