"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Boxes,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Filter,
  ImageIcon,
  LogOut,
  Pencil,
  PackagePlus,
  Search,
  Sun,
  Moon,
  Upload,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format";

type Category = { id: string; name: string; slug: string };
type Collection = { id: string; name: string; slug: string };
type Product = {
  id: string;
  name: string;
  slug: string;
  image: string;
  images: string;
  description: string;
  price: number;
  compareAt: number | null;
  categoryId: string;
  sizes: string;
  colors: string;
  material: string | null;
  care: string | null;
  fit: string | null;
  stock: number;
  status: string;
  featured: boolean;
  newArrival: boolean;
  category: Category | null;
  updatedAt: string;
  collections: { collectionId: string; collection: Collection }[];
};
type Order = {
  id: string;
  number: string;
  email: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  shippingName: string;
  shippingCity: string;
  shippingCountry: string;
  items: { id: string; name: string; quantity: number; price: number; size?: string | null; color?: string | null }[];
};
type Customer = {
  id: string;
  email: string;
  name: string;
  role: string;
  source: string;
  orderCount: number;
  wishlistCount: number;
  reviewCount: number;
  totalSpent: number;
  lastOrderAt: string;
};

const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["unpaid", "pending", "paid", "refunded", "failed"];
const AVAILABLE_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Ivory", hex: "#F5F0E8" },
  { name: "Champagne", hex: "#E8D5C4" },
  { name: "Blush", hex: "#E8B4BC" },
  { name: "Plum", hex: "#6B1B3C" },
  { name: "Navy", hex: "#1B2A4A" },
  { name: "Charcoal", hex: "#3A3A3A" },
  { name: "Cognac", hex: "#8B5A2B" },
  { name: "Sage", hex: "#9CAF88" },
];

const emptyProduct = {
  name: "",
  slug: "",
  description: "",
  price: "",
  compareAt: "",
  image: "",
  images: "",
  categoryId: "",
  collectionIds: [] as string[],
  sizes: "XS, S, M, L, XL",
  colors: "Black:#000000, Ivory:#F5F0E8",
  material: "",
  care: "",
  fit: "",
  stock: "20",
  status: "draft",
  featured: false,
  newArrival: false,
};

export default function AdminPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [productForm, setProductForm] = React.useState(emptyProduct);
  const [productSearch, setProductSearch] = React.useState("");
  const [productCategory, setProductCategory] = React.useState("all");
  const [editingProduct, setEditingProduct] = React.useState<(Product & { collectionIds?: string[] }) | null>(null);
  const [orderSearch, setOrderSearch] = React.useState("");

  React.useEffect(() => setMounted(true), []);

  const auth = useQuery({
    queryKey: ["admin-auth"],
    queryFn: () => fetchJson<{ authenticated: boolean; admin: { email: string } | null }>("/api/admin/auth/me"),
    retry: false,
  });
  const isAuthed = auth.data?.authenticated === true;

  React.useEffect(() => {
    if (auth.data && !auth.data.authenticated) {
      router.replace("/admin/login");
    }
  }, [auth.data, router]);

  const dashboard = useQuery({
    queryKey: ["admin-dashboard"],
    enabled: isAuthed,
    queryFn: () => fetchJson<{ stats: { productCount: number; activeProductCount: number; orderCount: number; customerCount: number; revenue: number }; lowStock: Product[]; recentOrders: Order[] }>("/api/admin/dashboard"),
  });
  const products = useQuery({
    queryKey: ["admin-products"],
    enabled: isAuthed,
    queryFn: () => fetchJson<{ products: Product[] }>("/api/admin/products"),
  });
  const orders = useQuery({
    queryKey: ["admin-orders"],
    enabled: isAuthed,
    queryFn: () => fetchJson<{ orders: Order[] }>("/api/admin/orders"),
  });
  const customers = useQuery({
    queryKey: ["admin-customers"],
    enabled: isAuthed,
    queryFn: () => fetchJson<{ customers: Customer[] }>("/api/admin/customers"),
  });
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchJson<{ categories: Category[] }>("/api/categories"),
  });
  const collections = useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchJson<{ collections: Collection[] }>("/api/collections"),
  });

  const createProduct = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create product");
      return data;
    },
    onSuccess: () => {
      setProductForm(emptyProduct);
      void qc.invalidateQueries({ queryKey: ["admin-products"] });
      void qc.invalidateQueries({ queryKey: ["admin-dashboard"] });
      toast.success("Product added");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not update product");
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-products"] });
      void qc.invalidateQueries({ queryKey: ["admin-dashboard"] });
      setEditingProduct(null);
      toast.success("Product updated");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const uploadProductImage = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/uploads/product-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not upload product image");
      return data as { url: string };
    },
    onSuccess: ({ url }) => {
      setProductForm((prev) => ({
        ...prev,
        image: url,
        images: prev.images ? `${prev.images}, ${url}` : url,
      }));
      toast.success("Product image uploaded");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const uploadEditedProductImage = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/uploads/product-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not upload product image");
      return data as { url: string };
    },
    onSuccess: ({ url }) => {
      setEditingProduct((prev) => prev ? {
        ...prev,
        image: url,
        images: prev.images ? `${prev.images}, ${url}` : url,
      } : prev);
      toast.success("Product image uploaded");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const updateOrder = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Order> }) => {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not update order");
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-orders"] });
      void qc.invalidateQueries({ queryKey: ["admin-dashboard"] });
      void qc.invalidateQueries({ queryKey: ["admin-customers"] });
      toast.success("Order updated");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const selectedColors = parseColorInput(productForm.colors);
  const filteredProducts = (products.data?.products ?? []).filter((p) => {
    const matchesSearch = [p.name, p.slug, p.category?.name].join(" ").toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategory === "all" || p.category?.id === productCategory;
    return matchesSearch && matchesCategory;
  });
  const filteredOrders = (orders.data?.orders ?? []).filter((o) =>
    [o.number, o.email, o.shippingName, o.status, o.paymentStatus].join(" ").toLowerCase().includes(orderSearch.toLowerCase())
  );

  const stats = dashboard.data?.stats;

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    qc.clear();
    router.replace("/admin/login");
    router.refresh();
  }

  if (auth.isLoading || !isAuthed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Checking admin session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="border-b border-border/70 bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="rounded-sm border border-border bg-background px-3 py-2 shadow-sm">
              <BrandLogo />
            </div>
            <div className="hidden h-10 w-px bg-border sm:block" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Admin console</p>
              <h1 className="font-serif text-2xl">Dashboard</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-sm px-3 py-1">Payments ready: manual tracking</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {mounted && theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              {mounted && theme === "dark" ? "Light" : "Dark"}
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Operations</p>
          <h2 className="mt-2 font-serif text-4xl">Manage the platform</h2>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={Boxes} label="Products" value={stats ? `${stats.activeProductCount}/${stats.productCount}` : "..."} detail="active / total" />
        <Metric icon={ClipboardList} label="Orders" value={stats ? String(stats.orderCount) : "..."} detail="all time" />
        <Metric icon={Users} label="Customers" value={stats ? String(stats.customerCount) : "..."} detail="registered accounts" />
        <Metric icon={CreditCard} label="Revenue" value={stats ? formatPrice(stats.revenue) : "..."} detail="non-cancelled orders" />
      </div>

      <Tabs defaultValue="products" className="mt-8">
        <TabsList className="grid w-full grid-cols-4 lg:w-[560px]">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
            <section className="rounded-sm border border-border/70 bg-background p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <PackagePlus className="h-4 w-4 text-primary" />
                <h2 className="font-serif text-xl">Add product</h2>
              </div>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  createProduct.mutate();
                }}
              >
                <Field label="Name"><Input value={productForm.name} onChange={(e) => setProductFormField("name", e.target.value, setProductForm)} required /></Field>
                <Field label="Slug"><Input value={productForm.slug} onChange={(e) => setProductFormField("slug", e.target.value, setProductForm)} required /></Field>
                <Field label="Description"><Textarea value={productForm.description} onChange={(e) => setProductFormField("description", e.target.value, setProductForm)} required /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Price (TZS)"><Input type="number" min="0" step="0.01" value={productForm.price} onChange={(e) => setProductFormField("price", e.target.value, setProductForm)} required /></Field>
                  <Field label="Stock"><Input type="number" min="0" value={productForm.stock} onChange={(e) => setProductFormField("stock", e.target.value, setProductForm)} /></Field>
                </div>
                <Field label="Category">
                  <Select value={productForm.categoryId} onValueChange={(v) => setProductFormField("categoryId", v, setProductForm)}>
                    <SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger>
                    <SelectContent>{categories.data?.categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Product image">
                  <ProductImageUpload
                    image={productForm.image}
                    uploading={uploadProductImage.isPending}
                    onUpload={(file) => uploadProductImage.mutate(file)}
                    onImageChange={(value) => setProductFormField("image", value, setProductForm)}
                  />
                </Field>
                <Field label="Image gallery">
                  <Input value={productForm.images} onChange={(e) => setProductFormField("images", e.target.value, setProductForm)} placeholder="Uploaded image URLs appear here" />
                </Field>
                <Field label="Sizes"><Input value={productForm.sizes} onChange={(e) => setProductFormField("sizes", e.target.value, setProductForm)} /></Field>
                <Field label="Available colors">
                  <ColorSelector
                    selected={selectedColors}
                    onToggle={(color) => {
                      const exists = selectedColors.some((c) => c.name === color.name);
                      const next = exists
                        ? selectedColors.filter((c) => c.name !== color.name)
                        : [...selectedColors, color];
                      setProductForm((prev) => ({ ...prev, colors: formatColors(next) }));
                    }}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Status">
                    <Select value={productForm.status} onValueChange={(v) => setProductFormField("status", v, setProductForm)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Collections">
                    <Select onValueChange={(v) => setProductForm((prev) => ({ ...prev, collectionIds: prev.collectionIds.includes(v) ? prev.collectionIds : [...prev.collectionIds, v] }))}>
                      <SelectTrigger><SelectValue placeholder={`${productForm.collectionIds.length} selected`} /></SelectTrigger>
                      <SelectContent>{collections.data?.collections.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                </div>
                <Button type="submit" className="w-full" disabled={createProduct.isPending}>
                  {createProduct.isPending ? "Adding..." : "Add product"}
                </Button>
              </form>
            </section>

            <section className="min-w-0">
              <div className="rounded-sm border border-border/70 bg-background p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-xl">Products by category</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Showing {filteredProducts.length} of {products.data?.products.length ?? 0} products
                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <SearchBox value={productSearch} onChange={setProductSearch} placeholder="Search products" />
                    <div className="min-w-[220px]">
                      <Select value={productCategory} onValueChange={setProductCategory}>
                        <SelectTrigger>
                          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All categories</SelectItem>
                          {categories.data?.categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <CategorySummary categories={categories.data?.categories ?? []} products={products.data?.products ?? []} active={productCategory} onSelect={setProductCategory} />
              </div>

              <div className="mt-3 overflow-hidden rounded-sm border border-border/70 bg-background shadow-sm">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="grid gap-3 border-b border-border/60 p-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_120px_130px_120px_96px] md:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{p.category?.name ?? "No category"} · {p.slug}</p>
                    </div>
                    <Input type="number" min="0" defaultValue={p.stock} onBlur={(e) => updateProduct.mutate({ id: p.id, patch: { stock: Number(e.target.value) } })} />
                    <Select value={p.status} onValueChange={(status) => updateProduct.mutate({ id: p.id, patch: { status } })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm font-medium md:text-right">{formatPrice(p.price)}</p>
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditingProduct(productForEditing(p))}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">No products match this category or search.</div>
                )}
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <SearchBox value={orderSearch} onChange={setOrderSearch} placeholder="Search orders" />
          <div className="mt-3 overflow-hidden rounded-sm border border-border/70 bg-background shadow-sm">
            {filteredOrders.map((o) => (
              <div key={o.id} className="grid gap-4 border-b border-border/60 p-4 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_150px_160px_120px] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{o.number}</p>
                    <StatusBadge status={o.status} />
                    <PaymentBadge status={o.paymentStatus} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {o.shippingName} · {o.email} · {o.items.reduce((n, i) => n + i.quantity, 0)} item(s)
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{o.shippingCity}, {o.shippingCountry} · {dateLabel(o.createdAt)}</p>
                </div>
                <Select value={o.status} onValueChange={(status) => updateOrder.mutate({ id: o.id, patch: { status } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ORDER_STATUSES.map((s) => <SelectItem key={s} value={s}>{title(s)}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={o.paymentStatus ?? "unpaid"} onValueChange={(paymentStatus) => updateOrder.mutate({ id: o.id, patch: { paymentStatus } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PAYMENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{title(s)}</SelectItem>)}</SelectContent>
                </Select>
                <p className="text-sm font-medium lg:text-right">{formatPrice(o.total)}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          <div className="overflow-hidden rounded-sm border border-border/70 bg-background shadow-sm">
            {(customers.data?.customers ?? []).map((c) => (
              <div key={c.id} className="grid gap-3 border-b border-border/60 p-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_120px_140px_120px] md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{c.name}</p>
                    <Badge variant="outline" className="capitalize">{c.source}</Badge>
                    {c.role === "admin" && <Badge>Admin</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{c.email}</p>
                </div>
                <p className="text-sm">{c.orderCount} orders</p>
                <p className="text-sm">{c.wishlistCount} wishlist · {c.reviewCount} reviews</p>
                <p className="text-sm font-medium md:text-right">{formatPrice(c.totalSpent)}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <OverviewList title="Recent orders" rows={(dashboard.data?.recentOrders ?? []).map((o) => ({ id: o.id, title: o.number, meta: `${o.email} · ${dateLabel(o.createdAt)}`, value: formatPrice(o.total) }))} />
            <OverviewList title="Low stock" rows={(dashboard.data?.lowStock ?? []).map((p) => ({ id: p.id, title: p.name, meta: p.status, value: `${p.stock} left` }))} />
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                updateProduct.mutate({
                  id: editingProduct.id,
                  patch: {
                    name: editingProduct.name,
                    slug: editingProduct.slug,
                    description: editingProduct.description,
                    price: editingProduct.price,
                    compareAt: editingProduct.compareAt,
                    image: editingProduct.image,
                    images: editingProduct.images,
                    categoryId: editingProduct.categoryId,
                    collectionIds: editingProduct.collectionIds ?? [],
                    sizes: editingProduct.sizes,
                    colors: editingProduct.colors,
                    material: editingProduct.material,
                    care: editingProduct.care,
                    fit: editingProduct.fit,
                    stock: editingProduct.stock,
                    featured: editingProduct.featured,
                    newArrival: editingProduct.newArrival,
                    status: editingProduct.status,
                  },
                });
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Name"><Input value={editingProduct.name} onChange={(e) => setEditingProduct((p) => p && { ...p, name: e.target.value })} required /></Field>
                <Field label="Slug"><Input value={editingProduct.slug} onChange={(e) => setEditingProduct((p) => p && { ...p, slug: e.target.value })} required /></Field>
              </div>
              <Field label="Description"><Textarea value={editingProduct.description} onChange={(e) => setEditingProduct((p) => p && { ...p, description: e.target.value })} required /></Field>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Price (TZS)"><Input type="number" min="0" value={editingProduct.price} onChange={(e) => setEditingProduct((p) => p && { ...p, price: Number(e.target.value) })} required /></Field>
                <Field label="Compare at (TZS)"><Input type="number" min="0" value={editingProduct.compareAt ?? ""} onChange={(e) => setEditingProduct((p) => p && { ...p, compareAt: e.target.value ? Number(e.target.value) : null })} /></Field>
                <Field label="Stock"><Input type="number" min="0" value={editingProduct.stock} onChange={(e) => setEditingProduct((p) => p && { ...p, stock: Number(e.target.value) })} /></Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Category">
                  <Select value={editingProduct.categoryId} onValueChange={(categoryId) => setEditingProduct((p) => p && { ...p, categoryId })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.data?.categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Status">
                  <Select value={editingProduct.status} onValueChange={(status) => setEditingProduct((p) => p && { ...p, status })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Product image">
                <ProductImageUpload
                  image={editingProduct.image}
                  uploading={uploadEditedProductImage.isPending}
                  onUpload={(file) => uploadEditedProductImage.mutate(file)}
                  onImageChange={(image) => setEditingProduct((p) => p && { ...p, image })}
                />
              </Field>
              <Field label="Image gallery"><Input value={editingProduct.images} onChange={(e) => setEditingProduct((p) => p && { ...p, images: e.target.value })} /></Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Sizes"><Input value={editingProduct.sizes} onChange={(e) => setEditingProduct((p) => p && { ...p, sizes: e.target.value })} /></Field>
                <Field label="Collections">
                  <Select onValueChange={(collectionId) => setEditingProduct((p) => p && { ...p, collectionIds: p.collectionIds?.includes(collectionId) ? p.collectionIds.filter((id) => id !== collectionId) : [...(p.collectionIds ?? []), collectionId] })}>
                    <SelectTrigger><SelectValue placeholder={`${editingProduct.collectionIds?.length ?? 0} selected`} /></SelectTrigger>
                    <SelectContent>{collections.data?.collections.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Available colors">
                <ColorSelector
                  selected={parseColorInput(editingProduct.colors)}
                  onToggle={(color) => {
                    const selected = parseColorInput(editingProduct.colors);
                    const exists = selected.some((c) => c.name === color.name);
                    const next = exists ? selected.filter((c) => c.name !== color.name) : [...selected, color];
                    setEditingProduct((p) => p && { ...p, colors: formatColors(next) });
                  }}
                />
              </Field>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Material"><Input value={editingProduct.material ?? ""} onChange={(e) => setEditingProduct((p) => p && { ...p, material: e.target.value })} /></Field>
                <Field label="Care"><Input value={editingProduct.care ?? ""} onChange={(e) => setEditingProduct((p) => p && { ...p, care: e.target.value })} /></Field>
                <Field label="Fit"><Input value={editingProduct.fit ?? ""} onChange={(e) => setEditingProduct((p) => p && { ...p, fit: e.target.value })} /></Field>
              </div>
              <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
                <Button type="submit" disabled={updateProduct.isPending}>{updateProduct.isPending ? "Saving..." : "Save changes"}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

function setProductFormField(
  key: keyof typeof emptyProduct,
  value: string,
  setProductForm: React.Dispatch<React.SetStateAction<typeof emptyProduct>>
) {
  setProductForm((prev) => ({ ...prev, [key]: value }));
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, detail }: { icon: React.ElementType; label: string; value: string; detail: string }) {
  return (
    <div className="rounded-sm border border-border/70 bg-background p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function ProductImageUpload({
  image,
  uploading,
  onUpload,
  onImageChange,
}: {
  image: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  onImageChange: (value: string) => void;
}) {
  const inputId = React.useId();

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[120px_minmax(0,1fr)]">
        <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-sm border border-border bg-muted/40">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="Product preview" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div className="space-y-3">
          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              e.currentTarget.value = "";
            }}
          />
          <Button type="button" variant="outline" className="w-full" disabled={uploading} asChild>
            <label htmlFor={inputId}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload image"}
            </label>
          </Button>
          <Input value={image} onChange={(e) => onImageChange(e.target.value)} placeholder="Image URL" />
          <p className="text-xs text-muted-foreground">JPG, PNG, WebP, or GIF. Max 5MB.</p>
        </div>
      </div>
    </div>
  );
}

function ColorSelector({
  selected,
  onToggle,
}: {
  selected: { name: string; hex: string }[];
  onToggle: (color: { name: string; hex: string }) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-2">
        {AVAILABLE_COLORS.map((color) => {
          const active = selected.some((c) => c.name === color.name);
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onToggle(color)}
              title={color.name}
              className={`flex aspect-square items-center justify-center rounded-sm border text-[0px] transition ${
                active ? "border-primary ring-2 ring-primary/25" : "border-border hover:border-primary/60"
              }`}
            >
              <span
                className="h-6 w-6 rounded-full border border-black/10"
                style={{ backgroundColor: color.hex }}
              />
            </button>
          );
        })}
      </div>
      <div className="flex min-h-7 flex-wrap gap-1.5">
        {selected.map((color) => (
          <Badge key={color.name} variant="secondary" className="rounded-sm">
            <span className="h-2.5 w-2.5 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
            {color.name}
          </Badge>
        ))}
        {selected.length === 0 && <p className="text-xs text-muted-foreground">Select at least one color.</p>}
      </div>
    </div>
  );
}

function CategorySummary({
  categories,
  products,
  active,
  onSelect,
}: {
  categories: Category[];
  products: Product[];
  active: string;
  onSelect: (categoryId: string) => void;
}) {
  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <button
        type="button"
        onClick={() => onSelect("all")}
        className={`rounded-sm border px-3 py-2 text-left transition ${
          active === "all" ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"
        }`}
      >
        <p className="text-sm font-medium">All categories</p>
        <p className="text-xs text-muted-foreground">{products.length} products</p>
      </button>
      {categories.map((category) => {
        const count = products.filter((p) => p.category?.id === category.id).length;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`rounded-sm border px-3 py-2 text-left transition ${
              active === category.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"
            }`}
          >
            <p className="truncate text-sm font-medium">{category.name}</p>
            <p className="text-xs text-muted-foreground">{count} products</p>
          </button>
        );
      })}
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-9" />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <Badge variant={status === "cancelled" || status === "archived" ? "destructive" : status === "active" || status === "delivered" ? "default" : "secondary"} className="capitalize">{status}</Badge>;
}

function PaymentBadge({ status }: { status: string }) {
  return (
    <Badge variant={status === "paid" ? "default" : status === "failed" ? "destructive" : "outline"} className="capitalize">
      {status === "paid" && <CheckCircle2 className="h-3 w-3" />}
      {status}
    </Badge>
  );
}

function OverviewList({ title, rows }: { title: string; rows: { id: string; title: string; meta: string; value: string }[] }) {
  return (
    <section className="rounded-sm border border-border/70 bg-background p-4 shadow-sm">
      <h2 className="font-serif text-xl">{title}</h2>
      <div className="mt-3 divide-y divide-border/60">
        {rows.length === 0 ? <p className="py-4 text-sm text-muted-foreground">No records yet.</p> : rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{row.title}</p>
              <p className="truncate text-xs text-muted-foreground">{row.meta}</p>
            </div>
            <p className="shrink-0 text-sm font-medium">{row.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function dateLabel(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function title(value: string) {
  return value.replace(/^\w/, (m) => m.toUpperCase());
}

function productForEditing(product: Product): Product & { collectionIds: string[] } {
  return {
    ...product,
    images: arrayText(product.images),
    sizes: arrayText(product.sizes),
    colors: colorText(product.colors),
    collectionIds: product.collections.map((item) => item.collectionId),
  };
}

function arrayText(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((item) => typeof item === "string").join(", ");
  } catch {}
  return value;
}

function colorText(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item) => item && typeof item.name === "string")
        .map((item) => `${item.name}:${item.hex || "#000000"}`)
        .join(", ");
    }
  } catch {}
  return value;
}

function parseColorInput(value: string) {
  return value
    .split(",")
    .map((part) => {
      const [name, hex] = part.split(":").map((x) => x.trim());
      return { name, hex: hex || "#000000" };
    })
    .filter((color) => color.name);
}

function formatColors(colors: { name: string; hex: string }[]) {
  return colors.map((color) => `${color.name}:${color.hex}`).join(", ");
}
