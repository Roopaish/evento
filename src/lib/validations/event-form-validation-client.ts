"use client"

import { eventFormSchema } from "@/lib/validations/event-form-validation"

import { zodImageUploadValidation } from "./image"

export const eventFormValidationClient = eventFormSchema.extend({
  assets: zodImageUploadValidation(),
  managerImage: zodImageUploadValidation({ max: 1 }),
})
