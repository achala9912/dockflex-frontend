"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { ProductFormData } from "@/schemas/Product/ProductSchema";
import FormField from "@/components/Fields/FormField";
import InputField from "@/components/InputField/InputField";
import CenterDropdown from "@/components/Dropdown/CenterDropdown";
import { getAllGenericNames } from "@/api/genericNameApi";
import SearchBar from "@/components/Searchbar/Searchbar";

interface IGenericName {
  _id: string;
  genericId: string;
  genericName: string;
}

function ProductForm() {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<ProductFormData>();

  const centerId = useWatch({ control, name: "centerId" });
  const genericId = useWatch({ control, name: "genericId" });

  const [genericNameSuggestions, setGenericNameSuggestions] = useState<
    IGenericName[]
  >([]);
  const [genericSearchTerm, setGenericSearchTerm] = useState("");

  const fetchGenericNames = useCallback(async () => {
    if (!centerId) return;
    try {
      const res = await getAllGenericNames({ centerId });
      if (res?.data) setGenericNameSuggestions(res.data);
    } catch (err) {
      console.error("Failed to fetch generic names", err);
    }
  }, [centerId]);

  useEffect(() => {
    fetchGenericNames();
  }, [fetchGenericNames]);

  useEffect(() => {
    if (genericId && genericNameSuggestions.length > 0) {
      const match = genericNameSuggestions.find((g) => g._id === genericId);
      if (match) {
        setGenericSearchTerm(match.genericName);
      }
    }
  }, [genericId, genericNameSuggestions]);

  const handleGenericSelect = (selected: string) => {
    const generic = genericNameSuggestions.find(
      (g) => g.genericName === selected
    );
    if (generic) {
      setValue("genericId", generic._id);
      setGenericSearchTerm(generic.genericName);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Medical Center" error={errors.centerId?.message}>
          <Controller
            name="centerId"
            control={control}
            render={({ field }) => (
              <CenterDropdown
                id="centerId"
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Select Medical Center"
              />
            )}
          />
        </FormField>

        <FormField label="Product Name" error={errors.productName?.message}>
          <Controller
            name="productName"
            control={control}
            render={({ field }) => (
              <InputField
                id="productName"
                uppercase
                type="text"
                {...field}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                placeholder="Enter Product Name"
              />
            )}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Generic Name" error={errors.genericId?.message}>
          <Controller
            name="genericId"
            control={control}
            render={() => (
              <SearchBar
                id="genSearch"
                value={genericSearchTerm}
                placeholder="Search Generic Name"
                onChange={(e) => setGenericSearchTerm(e.target.value)}
                suggestions={genericNameSuggestions.map((g) => g.genericName)}
                onSuggestionSelect={handleGenericSelect}
                width="w-full"
              />
            )}
          />
        </FormField>

        <FormField label="Remark (Optional)" error={errors.remark?.message}>
          <Controller
            name="remark"
            control={control}
            render={({ field }) => (
              <InputField
                id="remark"
                uppercase
                type="text"
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Enter remark"
              />
            )}
          />
        </FormField>
      </div>
    </div>
  );
}

export default ProductForm;
