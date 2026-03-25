"use client";

import { useState, useMemo, useCallback } from "react";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Package, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  MoreVertical,
  ExternalLink
} from "lucide-react";
import { Category, Product, ProductWithCategory } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/Table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate, formatPrice, cn } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

type SortField = "name" | "price" | "createdAt" | "updatedAt";
type SortOrder = "asc" | "desc";

export function ProductTable({ products, categories, onEdit, onDelete }: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Memoize the data join operation
  const productsWithCategories: ProductWithCategory[] = useMemo(() => {
    return products.map(p => ({
      ...p,
      categoryName: categories.find(c => c.id === p.categoryId)?.name || "Uncategorized"
    }));
  }, [products, categories]);

  // Memoize complex filtering and sorting logic
  const filteredProducts = useMemo(() => {
    return productsWithCategories
      .filter(p => {
        const matchesSearch = 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter !== "all" ? p.categoryId === categoryFilter : true;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const factor = sortOrder === "asc" ? 1 : -1;
        if (sortField === "price") return (a.price - b.price) * factor;
        
        const valA = a[sortField].toString().toLowerCase();
        const valB = b[sortField].toString().toLowerCase();
        return valA.localeCompare(valB) * factor;
      });
  }, [productsWithCategories, search, categoryFilter, sortField, sortOrder]);

  const toggleSort = useCallback((field: SortField) => {
    setSortOrder((prev) => {
      if (sortField === field) {
        return prev === "asc" ? "desc" : "asc";
      }
      return "asc";
    });
    setSortField(field);
  }, [sortField]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />;
    return sortOrder === "asc" ? 
      <ArrowUp className="ml-2 h-3 w-3 text-primary animate-in fade-in zoom-in" /> : 
      <ArrowDown className="ml-2 h-3 w-3 text-primary animate-in fade-in zoom-in" />;
  };

  return (
    <Card className="border-none shadow-md overflow-hidden bg-card/60 backdrop-blur-md">
      <div className="p-4 border-b flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search products by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-background/50 border-border/50">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead 
                onClick={() => toggleSort("name")} 
                className="cursor-pointer hover:text-foreground transition-colors h-12"
              >
                <div className="flex items-center">Product <SortIcon field="name" /></div>
              </TableHead>
              <TableHead className="h-12">Category</TableHead>
              <TableHead className="hidden md:table-cell h-12">Description</TableHead>
              <TableHead 
                onClick={() => toggleSort("price")} 
                className="cursor-pointer hover:text-foreground transition-colors h-12"
              >
                <div className="flex items-center">Price <SortIcon field="price" /></div>
              </TableHead>
              <TableHead 
                onClick={() => toggleSort("createdAt")} 
                className="cursor-pointer hover:text-foreground transition-colors hidden sm:table-cell h-12"
              >
                <div className="flex items-center">Created <SortIcon field="createdAt" /></div>
              </TableHead>
              <TableHead className="text-right h-12 pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                    No products matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <motion.tr
                    layout
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group border-b border-border/40 hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-semibold py-4 border-none">{product.name}</TableCell>
                    <TableCell className="border-none">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-none shadow-none">
                        {product.categoryName}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[200px] truncate text-muted-foreground border-none">
                      {product.description}
                    </TableCell>
                    <TableCell className="font-mono font-medium text-foreground border-none">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-[10px] text-muted-foreground/80 border-none">
                      {formatDate(product.createdAt)}
                    </TableCell>
                    <TableCell className="text-right pr-6 border-none">
                      <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(product)}
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(product.id)}
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </CardContent>
      <div className="p-4 bg-muted/20 border-t flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
        <span>Showing {filteredProducts.length} entries</span>
        <span>Storage: LocalBrowser</span>
      </div>
    </Card>
  );
}
