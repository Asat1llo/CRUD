"use client";

import { useState } from "react";
import { Plus, Tags, Pencil, Trash2, BoxSelect } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/Button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/Dialog";
import { PageContainer } from "@/components/layout/PageContainer";
import { CategoryForm } from "@/components/features/categories/CategoryForm";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/Table";
import { CategoryFormData } from "@/lib/schemas";
import { Category } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data.name);
    } else {
      addCategory(data.name);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (confirmDeleteId) {
      deleteCategory(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  return (
    <PageContainer
      title="Categories"
      description="Organize your products with custom categories"
      action={
        <Button onClick={handleAdd} className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      }
    >
      <div className="max-w-4xl">
        {categories.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted bg-card/40 p-16 text-center backdrop-blur-sm"
          >
            <div className="mb-6 rounded-full bg-primary/10 p-5 ring-8 ring-primary/5">
              <Tags className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold">No categories yet</h3>
            <p className="mb-8 text-muted-foreground max-w-sm mx-auto">
              Ready to organize? Start by creating your first category for your product inventory.
            </p>
            <Button onClick={handleAdd} variant="secondary" size="lg">
              Create First Category
            </Button>
          </motion.div>
        ) : (
          <Card className="border-none shadow-md overflow-hidden bg-card/60 backdrop-blur-md">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="pl-6 h-12 uppercase text-[10px] tracking-widest font-bold">Category Name</TableHead>
                    <TableHead className="h-12 uppercase text-[10px] tracking-widest font-bold">ID Hash</TableHead>
                    <TableHead className="text-right h-12 pr-6 uppercase text-[10px] tracking-widest font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {categories.map((category) => (
                      <motion.tr
                        layout
                        key={category.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group border-b border-border/40 hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="pl-6 py-4 border-none font-semibold">
                          {category.name}
                        </TableCell>
                        <TableCell className="border-none">
                          <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                            {category.id}
                          </code>
                        </TableCell>
                        <TableCell className="text-right pr-6 border-none">
                          <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(category)}
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setConfirmDeleteId(category.id)}
                              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </CardContent>
            <div className="p-3 bg-muted/20 border-t text-[9px] text-muted-foreground/60 text-center uppercase tracking-[0.2em]">
              Data synced with local storage engine
            </div>
          </Card>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription>
              Assign a name to your category. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            initialData={editingCategory ? { name: editingCategory.name } : undefined}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the category and may affect products assigned to it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
