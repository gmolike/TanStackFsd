// src/features/article-management/update/ui/update-article-dialog.tsx

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Package } from 'lucide-react';

import type { Article, UpdateArticle } from '~/entities/article';
import {
  articleCategoryOptionsList,
  articleStatusOptionsList,
  articleTagOptionsList,
  articleUnitOptionsList,
  getSubcategoryOptions,
  taxRateOptionsList,
  updateArticleSchema,
} from '~/entities/article';
import { useUpdateArticle } from '~/entities/article/api';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/shared/shadcn';
import {
  FormCheckbox,
  FormCombobox,
  FormInput,
  FormMultiSelect,
  FormProvider,
  FormSelect,
  FormTextArea,
} from '~/shared/ui/form';

/**
 * Update Article Dialog
 *
 * @component
 * @description Dialog zum Bearbeiten eines bestehenden Artikels
 */

interface UpdateArticleDialogProps {
  /** Artikel zum Bearbeiten */
  article: Article;
  /** Trigger Element (optional) */
  trigger?: React.ReactNode;
  /** Callback nach erfolgreichem Update */
  onSuccess?: (article: Article) => void;
  /** Dialog offen state (controlled) */
  open?: boolean;
  /** Dialog open change handler (controlled) */
  onOpenChange?: (open: boolean) => void;
}

export function UpdateArticleDialog({
  article,
  trigger,
  onSuccess,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: UpdateArticleDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(article.category);

  // Verwende controlled oder internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  // Form Setup mit aktuellen Artikel-Daten
  const form = useForm<UpdateArticle>({
    resolver: zodResolver(updateArticleSchema),
    defaultValues: {
      id: article.id,
      articleNumber: article.articleNumber,
      name: article.name,
      description: article.description || '',
      price: article.price,
      purchasePrice: article.purchasePrice,
      stock: article.stock,
      minStock: article.minStock,
      maxStock: article.maxStock,
      category: article.category,
      subcategory: article.subcategory,
      tags: article.tags,
      status: article.status,
      taxRate: article.taxRate,
      unit: article.unit,
      isDigital: article.isDigital,
      ean: article.ean || '',
      manufacturer: article.manufacturer || '',
      dimensions: article.dimensions
        ? {
            length: article.dimensions.length,
            width: article.dimensions.width,
            height: article.dimensions.height,
            weight: article.dimensions.weight,
            unit: article.dimensions.unit,
          }
        : undefined,
    },
  });

  // Reset form wenn sich der Artikel ändert
  useEffect(() => {
    form.reset({
      id: article.id,
      articleNumber: article.articleNumber,
      name: article.name,
      description: article.description || '',
      price: article.price,
      purchasePrice: article.purchasePrice,
      stock: article.stock,
      minStock: article.minStock,
      maxStock: article.maxStock,
      category: article.category,
      subcategory: article.subcategory,
      tags: article.tags,
      status: article.status,
      taxRate: article.taxRate,
      unit: article.unit,
      isDigital: article.isDigital,
      ean: article.ean || '',
      manufacturer: article.manufacturer || '',
      dimensions: article.dimensions,
    });
    setSelectedCategory(article.category);
  }, [article, form]);

  // Update Article Mutation
  const updateMutation = useUpdateArticle({
    onSuccess: (data) => {
      onSuccess?.(data);
      setOpen(false);
    },
  });

  // Form Submit Handler
  const handleSubmit = (data: UpdateArticle) => {
    updateMutation.mutate(data);
  };

  // Watch category für Subcategory Options
  const watchedCategory = form.watch('category');
  if (watchedCategory !== selectedCategory) {
    setSelectedCategory(watchedCategory);
    if (watchedCategory !== article.category) {
      form.setValue('subcategory', '');
    }
  }

  const subcategoryOptions = watchedCategory ? getSubcategoryOptions(watchedCategory) : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Artikel bearbeiten
          </DialogTitle>
          <DialogDescription>Bearbeiten Sie die Informationen für {article.name}</DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <ScrollArea className="max-h-[60vh] pr-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Grunddaten</TabsTrigger>
                  <TabsTrigger value="pricing">Preise & Lager</TabsTrigger>
                  <TabsTrigger value="additional">Zusätzlich</TabsTrigger>
                </TabsList>

                {/* Grunddaten Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      control={form.control}
                      name="articleNumber"
                      label="Artikelnummer"
                      placeholder="ART-001"
                      required
                    />
                    <FormInput
                      control={form.control}
                      name="name"
                      label="Name"
                      placeholder="Produktname"
                      required
                    />
                  </div>

                  <FormTextArea
                    control={form.control}
                    name="description"
                    label="Beschreibung"
                    placeholder="Detaillierte Produktbeschreibung..."
                    rows={3}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                      control={form.control}
                      name="category"
                      label="Kategorie"
                      options={articleCategoryOptionsList}
                      placeholder="Kategorie wählen..."
                      required
                    />
                    <FormSelect
                      control={form.control}
                      name="subcategory"
                      label="Unterkategorie"
                      options={subcategoryOptions}
                      placeholder="Unterkategorie wählen..."
                      disabled={!watchedCategory}
                    />
                  </div>

                  <FormSelect
                    control={form.control}
                    name="status"
                    label="Status"
                    options={articleStatusOptionsList}
                    required
                  />

                  <FormMultiSelect
                    control={form.control}
                    name="tags"
                    label="Tags"
                    options={articleTagOptionsList}
                    placeholder="Tags auswählen..."
                  />
                </TabsContent>

                {/* Preise & Lager Tab */}
                <TabsContent value="pricing" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      control={form.control}
                      name="price"
                      label="Verkaufspreis (€)"
                      type="number"
                      step="0.01"
                      required
                    />
                    <FormInput
                      control={form.control}
                      name="purchasePrice"
                      label="Einkaufspreis (€)"
                      type="number"
                      step="0.01"
                    />
                  </div>

                  <FormSelect
                    control={form.control}
                    name="taxRate"
                    label="Steuersatz"
                    options={taxRateOptionsList.map((opt) => ({
                      value: opt.value.toString(),
                      label: opt.label,
                    }))}
                    required
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormInput
                      control={form.control}
                      name="stock"
                      label="Lagerbestand"
                      type="number"
                      required
                    />
                    <FormInput
                      control={form.control}
                      name="minStock"
                      label="Mindestbestand"
                      type="number"
                      required
                    />
                    <FormInput
                      control={form.control}
                      name="maxStock"
                      label="Maximalbestand"
                      type="number"
                    />
                  </div>

                  <FormSelect
                    control={form.control}
                    name="unit"
                    label="Einheit"
                    options={articleUnitOptionsList}
                    required
                  />

                  <FormCheckbox
                    control={form.control}
                    name="isDigital"
                    label="Digitales Produkt"
                    description="Aktivieren Sie dies für Software, Lizenzen oder andere digitale Produkte"
                  />
                </TabsContent>

                {/* Zusätzliche Informationen Tab */}
                <TabsContent value="additional" className="space-y-4">
                  <FormInput
                    control={form.control}
                    name="ean"
                    label="EAN"
                    placeholder="1234567890123"
                    maxLength={13}
                  />

                  <FormInput
                    control={form.control}
                    name="manufacturer"
                    label="Hersteller"
                    placeholder="Herstellername"
                  />

                  <div className="rounded-lg border p-4">
                    <h4 className="mb-3 font-medium">Abmessungen (optional)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        control={form.control}
                        name="dimensions.length"
                        label="Länge (cm)"
                        type="number"
                        step="0.1"
                      />
                      <FormInput
                        control={form.control}
                        name="dimensions.width"
                        label="Breite (cm)"
                        type="number"
                        step="0.1"
                      />
                      <FormInput
                        control={form.control}
                        name="dimensions.height"
                        label="Höhe (cm)"
                        type="number"
                        step="0.1"
                      />
                      <FormInput
                        control={form.control}
                        name="dimensions.weight"
                        label="Gewicht (g)"
                        type="number"
                      />
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="rounded-lg border bg-muted/50 p-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground">Erstellt am:</span>
                        <p className="font-medium">
                          {new Date(article.createdAt).toLocaleString('de-DE')}
                        </p>
                      </div>
                      {article.updatedAt && (
                        <div>
                          <span className="text-muted-foreground">Zuletzt aktualisiert:</span>
                          <p className="font-medium">
                            {new Date(article.updatedAt).toLocaleString('de-DE')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </ScrollArea>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateMutation.isPending}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Wird gespeichert...' : 'Änderungen speichern'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
