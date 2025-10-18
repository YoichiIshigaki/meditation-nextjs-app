import type { Timestamp } from 'firebase/firestore';

export type MediMateAttribute = {
  created_at: Date;
  updated_at: Date;
}

export type MediMateType<T extends Record<string, unknown>> = T & MediMateAttribute; 

export type MediMateDocAttribute = {
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type MediMateDocType<T extends Record<string, unknown>> = T & MediMateDocAttribute; 