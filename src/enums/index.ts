export enum ProfileTypes {
  DEFAULT = 'default',
  ADMIN = 'admin'
}

export enum EmailStatusTypes {
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed'
}

export enum MentorApplicationStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  APPROVED = 'approved'
}

export enum MenteeApplicationStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  REVOKED = 'revoked'
}

export enum StatusUpdatedBy {
  ADMIN = 'admin',
  MENTOR = 'mentor'
}

export enum ReminderStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  SENDING = 'sending'
}
