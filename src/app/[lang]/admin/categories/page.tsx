"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { AdminTemplate } from "@/components/templates/AdminTemplate";
import { CategoryList } from "@/components/organisms/CategoryList";
import { CategoryForm } from "@/components/organisms/CategoryForm";
import { useLanguage, useTranslation } from "@/i18n/client";
import type { Category } from "@/models/category";
import type { CategoryFormSchema } from "@/schema/category";

export default function AdminCategoriesPage() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: CategoryFormSchema) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert(t("admin:createSuccess"));
        setShowForm(false);
        fetchCategories();
      } else {
        alert(t("admin:error"));
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert(t("admin:error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: CategoryFormSchema) => {
    if (!editingCategory) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert(t("admin:updateSuccess"));
        setEditingCategory(null);
        fetchCategories();
      } else {
        alert(t("admin:error"));
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert(t("admin:error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin:deleteConfirm"))) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert(t("admin:deleteSuccess"));
        fetchCategories();
      } else {
        alert(t("admin:error"));
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(t("admin:error"));
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <AdminTemplate>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {t("admin:categoryList")}
          </h1>
          {!showForm && !editingCategory && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t("admin:createCategory")}
            </button>
          )}
        </div>

        {(showForm || editingCategory) && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editingCategory
                  ? t("admin:editCategory")
                  : t("admin:createCategory")}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CategoryForm
              initialData={editingCategory || undefined}
              onSubmit={editingCategory ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditingCategory(null);
              }}
              isLoading={isSubmitting}
            />
          </div>
        )}

        <CategoryList
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </AdminTemplate>
  );
}
