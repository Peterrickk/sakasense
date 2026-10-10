"use client";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FieldError, Label } from "@/components/ui/label";
import { saveProduct } from "@/server/actions/admin";
import type { FormState } from "@/server/form-state";
import type { Product } from "@/db/schema";

const initial: FormState = { ok: false };

export function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState(saveProduct, initial);
  const [specs, setSpecs] = useState(
    product?.specs.length ? product.specs : [{ label: "", value: "" }],
  );

  useEffect(() => {
    if (!state.message) return;
    (state.ok ? toast.success : toast.error)(state.message);
  }, [state]);

  const err = state.errors ?? {};
  return (
    <form action={action} className="grid max-w-3xl gap-5" noValidate>
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={product?.name}
            required
            aria-invalid={!!err.name}
          />
          <FieldError message={err.name} />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={product?.slug}
            required
            aria-invalid={!!err.slug}
          />
          <FieldError message={err.slug} />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select id="category" name="category" defaultValue={product?.category ?? "device"}>
            <option value="device">Device</option>
            <option value="bundle">Bundle</option>
            <option value="accessory">Accessory</option>
            <option value="subscription">Subscription</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" defaultValue={product?.sku ?? ""} />
        </div>
        <div>
          <Label htmlFor="pricePesos">Price (₱) — 0 = price coming soon</Label>
          <Input
            id="pricePesos"
            name="pricePesos"
            type="number"
            step="0.01"
            min="0"
            defaultValue={((product?.priceCentavos ?? 0) / 100).toString()}
          />
          <FieldError message={err.pricePesos} />
        </div>
        <div>
          <Label htmlFor="comparePesos">Compare-at price (₱, optional)</Label>
          <Input
            id="comparePesos"
            name="comparePesos"
            type="number"
            step="0.01"
            min="0"
            defaultValue={
              product?.compareAtCentavos ? (product.compareAtCentavos / 100).toString() : ""
            }
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} />
        </div>
        <div>
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min="0"
            defaultValue={product?.sortOrder ?? 0}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" name="tagline" defaultValue={product?.tagline ?? ""} />
      </div>
      <div>
        <Label htmlFor="description">Description (markdown)</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description ?? ""}
          className="min-h-40"
        />
      </div>
      <div>
        <Label htmlFor="images">
          Images — one per line: <code>url | alt text</code>
        </Label>
        <Textarea
          id="images"
          name="images"
          defaultValue={product?.images.map((i) => `${i.url} | ${i.alt}`).join("\n")}
        />
      </div>
      <div>
        <Label htmlFor="inTheBox">What&apos;s in the box — one item per line</Label>
        <Textarea id="inTheBox" name="inTheBox" defaultValue={product?.inTheBox.join("\n")} />
      </div>

      <fieldset className="space-y-3">
        <legend className="mb-1.5 text-sm font-medium">Specifications</legend>
        {specs.map((s, i) => (
          <div key={i} className="flex gap-2">
            <Input
              aria-label={`Spec ${i + 1} label`}
              placeholder="Label"
              value={s.label}
              onChange={(e) =>
                setSpecs(specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
              }
            />
            <Input
              aria-label={`Spec ${i + 1} value`}
              placeholder="Value"
              value={s.value}
              onChange={(e) =>
                setSpecs(specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove spec"
              onClick={() => setSpecs(specs.filter((_, j) => j !== i))}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setSpecs([...specs, { label: "", value: "" }])}
        >
          <Plus /> Add spec
        </Button>
        <input
          type="hidden"
          name="specs"
          value={JSON.stringify(specs.filter((s) => s.label.trim()))}
        />
        <FieldError message={err.specs} />
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="bluetooth">Bluetooth note</Label>
          <Textarea
            id="bluetooth"
            name="bluetooth"
            defaultValue={product?.connectivity?.bluetooth ?? ""}
            className="min-h-20"
          />
        </div>
        <div>
          <Label htmlFor="wifi">Wi-Fi note</Label>
          <Textarea
            id="wifi"
            name="wifi"
            defaultValue={product?.connectivity?.wifi ?? ""}
            className="min-h-20"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="guideUrl">Guidebook URL (optional)</Label>
        <Input id="guideUrl" name="guideUrl" type="url" defaultValue={product?.guideUrl ?? ""} />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={product?.isActive ?? true}
            className="accent-primary size-4"
          />{" "}
          Active
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={product?.isFeatured ?? false}
            className="accent-primary size-4"
          />{" "}
          Featured
        </label>
      </div>
      <div>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Saving…" : "Save product"}
        </Button>
      </div>
    </form>
  );
}
