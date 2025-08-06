import Joi from 'joi'

export const validateCredentialRequest = (data: any) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    title: Joi.string().required().min(1).max(200),
    institution: Joi.string().required().min(1).max(100),
    type: Joi.string().valid('degree', 'certificate', 'certification', 'award').required(),
    date: Joi.date().required(),
    description: Joi.string().optional().max(500),
    metadata: Joi.object().optional()
  })

  return schema.validate(data)
}

export const validateHealthRequest = (data: any) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    type: Joi.string().valid('vaccination', 'checkup', 'lab', 'prescription', 'emergency').required(),
    title: Joi.string().required().min(1).max(200),
    provider: Joi.string().required().min(1).max(100),
    date: Joi.date().required(),
    description: Joi.string().optional().max(500),
    fileUrl: Joi.string().uri().optional(),
    metadata: Joi.object().optional()
  })

  return schema.validate(data)
}

export const validateAssignmentRequest = (data: any) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    title: Joi.string().required().min(1).max(200),
    course: Joi.string().required().min(1).max(100),
    dueDate: Joi.date().required(),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
    estimatedHours: Joi.number().min(0).max(100).optional(),
    description: Joi.string().optional().max(1000),
    metadata: Joi.object().optional()
  })

  return schema.validate(data)
}

export const validateAttendanceRequest = (data: any) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    course: Joi.string().required().min(1).max(100),
    date: Joi.date().required(),
    status: Joi.string().valid('present', 'absent', 'late', 'excused').required(),
    location: Joi.string().optional().max(100),
    notes: Joi.string().optional().max(500)
  })

  return schema.validate(data)
}

export const validatePublishingRequest = (data: any) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    title: Joi.string().required().min(1).max(300),
    authors: Joi.array().items(Joi.string()).min(1).required(),
    journal: Joi.string().required().min(1).max(200),
    abstract: Joi.string().required().min(50).max(2000),
    keywords: Joi.array().items(Joi.string()).optional(),
    fileUrl: Joi.string().uri().optional(),
    metadata: Joi.object().optional()
  })

  return schema.validate(data)
}

export const validateWalletRequest = (data: any) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    address: Joi.string().required().min(40).max(50),
    network: Joi.string().valid('ethereum', 'polygon', 'bsc', 'avalanche').required(),
    walletType: Joi.string().valid('metamask', 'walletconnect', 'coinbase').required()
  })

  return schema.validate(data)
}

export const validateMapRequest = (data: any) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    from: Joi.string().required().min(1).max(100),
    to: Joi.string().required().min(1).max(100),
    mode: Joi.string().valid('walking', 'driving', 'transit').default('walking')
  })

  return schema.validate(data)
}

export const validateResumeRequest = (data: any) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    personalInfo: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().optional(),
      location: Joi.string().optional(),
      linkedin: Joi.string().uri().optional(),
      github: Joi.string().uri().optional()
    }).required(),
    summary: Joi.string().optional().max(500),
    experience: Joi.array().items(Joi.object({
      title: Joi.string().required(),
      company: Joi.string().required(),
      duration: Joi.string().required(),
      description: Joi.string().required()
    })).optional(),
    education: Joi.array().items(Joi.object({
      degree: Joi.string().required(),
      institution: Joi.string().required(),
      year: Joi.string().required(),
      gpa: Joi.string().optional()
    })).optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    projects: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      technologies: Joi.array().items(Joi.string()).optional()
    })).optional()
  })

  return schema.validate(data)
}

export const validateResultsRequest = (data: any) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    semester: Joi.string().optional(),
    courses: Joi.array().items(Joi.object({
      code: Joi.string().required(),
      name: Joi.string().required(),
      credits: Joi.number().required(),
      grade: Joi.string().required(),
      professor: Joi.string().optional()
    })).optional()
  })

  return schema.validate(data)
}
