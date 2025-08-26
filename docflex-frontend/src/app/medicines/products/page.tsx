"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";

import RoundButton from "@/components/Buttons/RoundButton";
import InputField from "@/components/InputField/InputField";
import { Tooltip } from "@/components/ui/tooltip";
import CenterDropdown from "@/components/Dropdown/CenterDropdown";
import Pagination from "@/components/Table/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import DeleteConfirm from "@/components/Popups/DeleteConfirm";
import ProductCard from "@/components/Cards/ProductCard";
import SearchBar from "@/components/Searchbar/Searchbar";

import { getAllProducts, deleteProduct } from "@/api/productApi";
import { getAllGenericNames } from "@/api/genericNameApi";

interface IProduct {
  productId: string;
  productName: string;
  genericId: { id: string; genericId: string; genericName: string };
  remark?: string;
  centerId: { centerId: string; centerName: string };
}

interface IGenericName {
  _id: string;
  genericId: string;
  genericName: string;
}

function Page() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [genericNameSuggestions, setGenericNameSuggestions] = useState<
    IGenericName[]
  >([]);

  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [genericSearchTerm, setGenericSearchTerm] = useState("");
  const [selectedGenericId, setSelectedGenericId] = useState<string>();
  const [centerId, setCenterId] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 8;

  const debouncedProductSearchTerm = useDebounce(productSearchTerm, 500);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const [isNewPopupOpen, setIsNewPopupOpen] = useState(false);


  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      const res = await getAllProducts({
        page,
        limit,
        search: selectedGenericId
          ? undefined
          : debouncedProductSearchTerm.trim() || undefined,
        centerId,
        genericId: selectedGenericId,
      });
      setProducts(res.data || []);
      setTotalItems(res.total || 0);
      setTotalPages(res.totalPages || 0);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to fetch products");
      setProducts([]);
    }
  }, [page, limit, debouncedProductSearchTerm, centerId, selectedGenericId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  const fetchGenericNames = useCallback(async () => {
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


  const handleDeleteClick = useCallback((product: IProduct) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.productId);
      toast.success(
        `Product "${productToDelete.productName}" from "${productToDelete.centerId.centerName}" deleted successfully`
      );

      if (products.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchProducts();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to delete product");
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  }, [productToDelete, products, page, fetchProducts]);


  const handleGenericSelect = useCallback(
    (suggestion: string) => {
      const selected = genericNameSuggestions.find(
        (g) => g.genericName === suggestion
      );
      if (selected) {
        setSelectedGenericId(selected._id);
        setGenericSearchTerm(selected.genericName);
        setPage(1);
      }
    },
    [genericNameSuggestions]
  );


  const handleClearGeneric = useCallback(() => {
    setSelectedGenericId(undefined);
    setGenericSearchTerm("");
    setPage(1);
  }, []);

  return (
    <>
      <div className="flex justify-between mb-3">
        <h3 className="flex items-center font-semibold font-inter text-md">
          Products
        </h3>
      </div>


      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-4 w-full sm:w-auto">
            {/* Center Filter */}
            <CenterDropdown
              id="centerId"
              value={centerId || ""}
              onChange={(val) => {
                setCenterId(val);
                setPage(1);
              }}
              placeholder="Select Medical Center"
              width="md:w-[300px] w-full"
              label
              labelName="Center Name"
            />

            {/* Product Search */}
            <InputField
              id="product-search"
              width="w-full sm:w-[400px]"
              icon={<FiSearch />}
              type="text"
              value={productSearchTerm}
              placeholder="Search Product ID / Name"
              onChange={(e) => {
                setProductSearchTerm(e.target.value);
                setPage(1);
                setSelectedGenericId(undefined);
              }}
              label
              labelName="Product ID / Name"
              className="md:w-[350px] w-full"
            />

            {/* Generic Search */}
            <SearchBar
              id="genSearch"
              value={genericSearchTerm}
              placeholder="Search Generic Name..."
              onChange={(e) => setGenericSearchTerm(e.target.value)}
              suggestions={genericNameSuggestions.map((g) => g.genericName)}
              onSuggestionSelect={handleGenericSelect}
              handleClear={handleClearGeneric}
              label
              labelName="Generic ID / Name"
              width="md:w-[350px] w-full"
            />
          </div>

          <Tooltip content="Add New Product" side="top">
            <RoundButton
              icon={IoMdAdd}
              className="hover:bg-gray-300 bg-blue-800 text-white hover:text-blue-800"
              onClick={() => setIsNewPopupOpen(true)}
            />
          </Tooltip>
        </div>
      </div>

      {/* 🔹 Product List */}
      {error ? (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      ) : (
        <div className="flex flex-wrap gap-6 items-center justify-center sm:justify-start">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.productId}
                productId={product.productId}
                productName={product.productName}
                genericName={product.genericId.genericName}
                centerName={product.centerId.centerName}
                handleDelete={() => handleDeleteClick(product)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No matching products found.</p>
          )}
        </div>
      )}

      {/* 🔹 Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
          onPageChange={setPage}
        />
      </div>

      {/* 🔹 Delete Confirmation */}
      {isDeleteModalOpen && (
        <DeleteConfirm
          element={productToDelete ? `"${productToDelete.productName}"` : ""}
          onDelete={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isOpen={isDeleteModalOpen}
        />
      )}
    </>
  );
}

export default Page;
