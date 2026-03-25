"use client";

import { useState } from "react";
import { Plus, Package, Info } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
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
import { ProductForm } from "@/components/features/products/ProductForm";
import { ProductTable } from "@/components/features/products/ProductTable";
import { ProductFormData } from "@/lib/schemas";
import { Product } from "@/types";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/Card";

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (confirmDeleteId) {
      deleteProduct(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  return (
    <PageContainer
      title="Product Inventory"
      description="Manage and track your products across all categories"
      action={
        <Button onClick={handleAdd} className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          New Product
        </Button>
      }
    >
      <div className="space-y-8">
        {products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-muted bg-card/40 p-16 text-center backdrop-blur-sm shadow-inner"
          >
            <div className="mb-6 rounded-3xl bg-primary/10 p-6 flex items-center justify-center ring-1 ring-primary/20 shadow-xl shadow-primary/5">
              <Package className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Your inventory is empty</h3>
            <p className="mb-8 text-muted-foreground max-w-sm mx-auto text-balance">
              Start building your product list by adding products and assigning them to categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleAdd} size="lg" className="px-8 shadow-md">
                Add Product
              </Button>
              {categories.length === 0 && (
                <Button variant="outline" size="lg" onClick={() => window.location.href = "/categories"}>
                  Create Categories First
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <ProductTable
            products={products}
            categories={categories}
            onEdit={handleEdit}
            onDelete={(id) => setConfirmDeleteId(id)}
          />
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] border-none shadow-2xl bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {editingProduct ? "Update Product Details" : "Create New Product"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Fill in the information below to {editingProduct ? "update" : "add"} an item to your inventory.
            </DialogDescription>
          </DialogHeader>
          
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="p-3 bg-amber-500/10 rounded-full">
                <Info className="h-6 w-6 text-amber-500" />
              </div>
              <p className="text-muted-foreground max-w-[280px]">
                You must have at least one category before adding products.
              </p>
              <Button onClick={() => window.location.href = "/categories"}>
                Configure Categories
              </Button>
            </div>
          ) : (
            <ProductForm
              categories={categories}
              initialData={editingProduct ? { 
                name: editingProduct.name,
                categoryId: editingProduct.categoryId,
                description: editingProduct.description,
                price: editingProduct.price
              } : undefined}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px] border-destructive/20 border-2">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive">Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be reversed. Are you sure you want to remove this product from your inventory?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="flex-1 shadow-lg shadow-destructive/20">
              Delete Forever
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
