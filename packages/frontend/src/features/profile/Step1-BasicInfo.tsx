import React, { useEffect, useState } from "react"
import { Input } from "../../components/UI/Input/input"
import { AvatarSelector } from "../../components/Avater/AvaterSekector"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "../../components/UI/Button/button"

const schema = yup.object({
  name: yup.string().required("Name is required"),
})

type FormValues = {
  name: string
  projectLink?: string
  previewUrl?: string | null
  image?: File | string | null
}

type Step1Props = {
  nextStep: () => void
  handleDataChange: (data: FormValues) => void
  initialData: FormValues
  editingFromReview?: number | null
  setStep?: (step: number) => void
  setEditingFromReview?: (val: number | null) => void
}

const Step1_BasicInfo: React.FC<Step1Props> = ({
  nextStep,
  handleDataChange,
  initialData,
  editingFromReview,
  setStep,
  setEditingFromReview,
}) => {
  const [userEmail, setUserEmail] = useState<string>("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [image, setImage] = useState<File | string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialData.name || "",
      projectLink: initialData.projectLink || "",
      image: initialData.image ?? null,
      previewUrl: initialData.previewUrl ?? null,
    },
  })

  useEffect(() => {
    reset({
      name: initialData.name || "",
      projectLink: initialData.projectLink || "",
      image: initialData.image ?? null,
      previewUrl: initialData.previewUrl ?? null,
    })
  }, [initialData, reset])

  useEffect(() => {
    const storedUser = localStorage.getItem("userEmail")
    setUserEmail(storedUser || "")
  }, [])

  useEffect(() => {
    let objectUrl: string | undefined

    if (initialData.image) {
      setImage(initialData.image)

      if (typeof initialData.image === "string") {
        setPreviewUrl(initialData.image)
      } else if (initialData.image instanceof Blob) {
        objectUrl = URL.createObjectURL(initialData.image)
        setPreviewUrl(objectUrl)
      } else {
        setPreviewUrl(null)
      }
    } else {
      setImage(null)
      setPreviewUrl(null)
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [initialData.image])

  const handleImageSelected = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setImage(base64)
      setPreviewUrl(base64)

      handleDataChange({
        name: watch("name"),
        projectLink: watch("projectLink") || "",
        image: base64,
        previewUrl: base64,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleAvatarSelected = (url: string) => {
    setImage(url)
    setPreviewUrl(url)
    handleDataChange({
      name: watch("name"),
      projectLink: watch("projectLink") || "",
      image: url,
      previewUrl: url,
    })
  }

  const handleClearImage = () => {
    setImage(null)
    setPreviewUrl(null)
    handleDataChange({
      name: watch("name"),
      projectLink: watch("projectLink") || "",
      image: null,
      previewUrl: null,
    })
  }

  const onSubmit = (data: FormValues) => {
    handleDataChange({
      ...data,
      image: image ?? null,
      previewUrl: previewUrl ?? null,
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
      dir="ltr"
    >
      {/* כותרת במרכז */}
      <h2 className="text-3xl font-oswald text-primary text-center font-bold">
        Basic Information
      </h2>

      {/* בחירת תמונה / אווטר */}
      <AvatarSelector
        previewUrl={previewUrl}
        onImageSelected={handleImageSelected}
        onAvatarSelected={handleAvatarSelected}
        onClearImage={handleClearImage}
      />

      {/* שם מלא */}
      <div className="flex flex-col space-y-1 text-left">
        <label htmlFor="name" className="font-medium text-lg text-foreground text-left">
          Full Name <span className="text-destructive">*</span>
        </label>
        <Input
          type="text"
          id="name"
          {...register("name", {
            onChange: (e) => {
              handleDataChange({
                name: e.target.value,
                projectLink: watch("projectLink") || "",
                image: image ?? null,
                previewUrl: previewUrl ?? null,
              })
            },
          })}
          placeholder="Enter your full name"
          className="text-left text-white"
          // className="bg-input border border-border focus:ring-ring focus:border-primary text-white"
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* אימייל (קריאה בלבד) */}
      <div className="flex flex-col space-y-1 text-left">
        <label htmlFor="email" className="font-medium text-lg text-foreground text-left">
          Email
        </label>
        <Input
          type="email"
          id="email"
          value={userEmail}
          readOnly
          className="text-left text-white"
        />
      </div>

      {/* קישור לפרויקט */}
      <div className="flex flex-col space-y-1 text-left">
        <label htmlFor="projectLink" className="font-medium text-lg text-foreground text-left">
          Project Link
        </label>
        <Input
          type="text"
          id="projectLink"
          {...register("projectLink", {
            onChange: (e) => {
              handleDataChange({
                name: watch("name"),
                projectLink: e.target.value,
                image: image ?? null,
                previewUrl: previewUrl ?? null,
              })
            },
          })}
          placeholder="https://yourproject.com"
          className="text-left text-white"
        />
      </div>

      {/* כפתור הבא */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-2"
        >
          Next
        </Button>
      </div>
    </form>
  )
}

export default Step1_BasicInfo
