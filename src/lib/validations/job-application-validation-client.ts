import { zodImageUploadValidation } from "./image"
import { jobApplicationSchema } from "./job-application-validation"

export const jobApplicationSchemaClient = jobApplicationSchema
  .omit({
    jobPositionId: true,
  })
  .extend({
    // cv:zodImageUploadValidation({max:1})
  })
