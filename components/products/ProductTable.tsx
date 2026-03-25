"use client";

import { useState, useMemo } from "react";
import { 
  Plus, Pencil, Trash2, Package, Search, Filter, 
  ArrowUpDown, ArrowUp, ArrowDown 
} from "lucide-react";
import { Category, Product, ProductWithCategory } from "@/types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Table, THead, TBody, TR, TH, TD } from "../ui/Table";
import { formatDate, formatPrice, cn } from "@/lib/utils";

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
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const productsWithCategories: ProductWithCategory[] = useMemo(() => {
    return products.map(p => ({
      ...p,
      categoryName: categories.find(c => c.id === p.categoryId)?.name || "Unknown"
    }));
  }, [products, categories]);

  const filteredProducts = useMemo(() => {
    return productsWithCategories
      .filter(p => {
        const matchesSearch = 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter ? p.categoryId === categoryFilter : true;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const factor = sortOrder === "asc" ? 1 : -1;
        if (sortField === "price") return (a.price - b.price) * factor;
        const valA = a[sortField].toLowerCase();
        const valB = b[sortField].toLowerCase();
        if (valA < valB) return -1 * factor;
        if (valA > valB) return 1 * factor;
        return 0;
      });
  }, [productsWithCategories, search, categoryFilter, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortOrder === "asc" ? 
      <ArrowUp className="ml-2 h-4 w-4 text-indigo-600" /> : 
      <ArrowDown className="ml-2 h-4 w-4 text-indigo-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <Table>
          <THead>
            <TR>
              <TH onClick={() => toggleSort("name")} className="cursor-pointer hover:bg-slate-100 transition-colors">
                <span className="flex items-center">Product Name <SortIcon field="name" /></span>
              </TH>
              <TH>Category</TH>
              <TH>Description</TH>
              <TH onClick={() => toggleSort("price")} className="cursor-pointer hover:bg-slate-100 transition-colors">
                <span className="flex items-center">Price <SortIcon field="price" /></span>
              </TH>
              <TH onClick={() => toggleSort("createdAt")} className="cursor-pointer hover:bg-slate-100 transition-colors">
                <span className="flex items-center">Created <SortIcon field="createdAt" /></span>
              </TH>
              <TH onClick={() => toggleSort("updatedAt")} className="cursor-pointer hover:bg-slate-100 transition-colors">
                <span className="flex items-center">Updated <SortIcon field="updatedAt" /></span>
              </TH>
              <TH className="text-right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {filteredProducts.length === 0 ? (
              <TR>
                <TD colSpan={7} className="h-32 text-center text-slate-500">
                  No products found match your criteria.
                </TD>
              </TR>
            ) : (
              filteredProducts.map((product) => (
                <TR key={product.id}>
                  <TD className="font-medium text-slate-900">{product.name}</TD>
                  <TD>
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-medium text-indigo-700">
                      {product.categoryName}
                    </span>
                  </TD>
                  <TD className="max-w-[200px] truncate text-slate-500" title={product.description}>
                    {product.description}
                  </TD>
                  <TD className="font-semibold text-slate-900">{formatPrice(product.price)}</TD>
                  <TD className="text-slate-500">{formatDate(product.createdAt)}</TD>
                  <TD className="text-slate-500">{formatDate(product.updatedAt)}</TD>
                  <TD className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product)}
                        className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product.id)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2 text-xs text-slate-500">
        <p>Showing {filteredProducts.length} of {products.length} products</p>
      </div>
    </div>
  );
}
