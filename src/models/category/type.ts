import type { MediMateType, MediMateDocType } from "../common/type";

export type CategoryDoc = MediMateDocType<{
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
}>;

export type Category = MediMateType<{
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  created_at: Date;
  updated_at: Date;
}>;

export const toCategory = (id: string, categoryDoc: CategoryDoc): Category => ({
  id,
  name: categoryDoc.name,
  slug: categoryDoc.slug,
  description: categoryDoc.description ?? "",
  order: categoryDoc.order,
  created_at: categoryDoc.created_at.toDate(),
  updated_at: categoryDoc.updated_at.toDate(),
});
