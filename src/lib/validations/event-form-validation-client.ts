"use client"

import { eventFormSchema } from "@/lib/validations/event-form-validation"

import { zodImageUploadValidation } from "./image"

export const eventFormSchemaClient = eventFormSchema.extend({
  assets: zodImageUploadValidation(),
  managerImage: zodImageUploadValidation({ max: 1, isRequired: false }),
})
