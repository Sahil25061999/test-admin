"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Table } from "antd";
import { clientApi } from "../../../lib/client-api";
import { useToast } from "../../../context/toast.context";
import { useForm } from "react-hook-form";

export default function Page() {
  const [jewelleryList, setJewelleryList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesByMetalType, setCategoriesByMetalType] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [displayJewelleryModal, setDisplayJewelleryModal] = useState(false);
  const [displayCategoryModal, setDisplayCategoryModal] = useState(false);
  const [editingJewellery, setEditingJewellery] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [metalType, setMetalType] = useState<string>("gold");
  const [jewelleryMetalType, setJewelleryMetalType] = useState<string>("gold"); // For create jewellery modal
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);
  const [jewelleryImages, setJewelleryImages] = useState<Array<{ image_url: string; order: number; alt_text: string }>>(
    []
  );
  const { toast } = useToast();

  const {
    register: registerJewellery,
    handleSubmit: handleSubmitJewellery,
    reset: resetJewellery,
    formState: { errors: errorsJewellery },
    setValue: setValueJewellery,
    watch: watchJewellery,
  } = useForm();

  const {
    register: registerCategory,
    handleSubmit: handleSubmitCategory,
    reset: resetCategory,
    formState: { errors: errorsCategory },
  } = useForm();

  const fetchJewellery = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        metal_type: metalType,
        limit,
        offset,
      };
      if (genderFilter) params.gender = genderFilter;
      if (categoryFilter) params.category = categoryFilter;

      const response = await clientApi.getJewellery(params);
      if (response?.success && response?.data) {
        // Handle both array and object with items property
        const items = Array.isArray(response.data) ? response.data : response.data?.items || response.data?.data || [];
        setJewelleryList(items);
      }
    } catch (error) {
      console.error("Error fetching jewellery:", error);
      toast({
        title: "Error",
        description: "Failed to fetch jewellery",
      });
    } finally {
      setLoading(false);
    }
  }, [metalType, genderFilter, categoryFilter, limit, offset, toast]);

  // const fetchCategories = async () => {
  //   try {
  //     const response = await clientApi.getCategories();
  //     if (response?.success && response?.data) {
  //       setCategories(Array.isArray(response.data) ? response.data : []);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   }
  // };

  const fetchCategoriesByMetalType = useCallback(
    async (metal: string) => {
      try {
        const response = await clientApi.getCategoriesByMetalType(metal);
        if (response?.success && response?.data) {
          // Handle nested data structure: response.data.data.categories
          const categories = response.data?.categories || response.data?.data?.categories || [];
          setCategoriesByMetalType(Array.isArray(categories) ? categories : []);
        }
      } catch (error) {
        console.error("Error fetching categories by metal type:", error);
        toast({
          title: "Error",
          description: "Failed to fetch categories",
        });
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchJewellery();
    // fetchCategories();
    fetchCategoriesByMetalType(metalType);
  }, [fetchJewellery, fetchCategoriesByMetalType, metalType]);

  const handleCreateJewellery = async (data: any) => {
    try {
      setLoading(true);
      // Parse available_qty if it's a string
      let availableQty = {};
      if (data.available_qty) {
        try {
          availableQty = typeof data.available_qty === "string" ? JSON.parse(data.available_qty) : data.available_qty;
        } catch {
          availableQty = {};
        }
      }

      // Parse meta if it's a string
      let meta = {};
      if (data.meta) {
        try {
          meta = typeof data.meta === "string" ? JSON.parse(data.meta) : data.meta;
        } catch {
          meta = {};
        }
      }

      // Use jewelleryImages state instead of parsing JSON
      const images = jewelleryImages.map((img) => ({
        image_url: img.image_url,
        order: img.order || 0,
        alt_text: img.alt_text || null,
      }));

      const jewelleryData = {
        title: data.title,
        description: data.description || null,
        available_qty: availableQty,
        category: data.category,
        size: data.size ? parseFloat(data.size) : null,
        gender: data.gender || "UNISEX",
        meta: meta,
        images: images,
        metal: jewelleryMetalType,
      };

      const response = await clientApi.createJewellery(jewelleryData);

      if (response?.success) {
        toast({
          title: "Success",
          description: response.message || "Jewellery created successfully",
          variant: "success",
        });
        setDisplayJewelleryModal(false);
        resetJewellery();
        setJewelleryImages([]);
        setEditingJewellery(null);
        fetchJewellery();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create jewellery",
        });
      }
    } catch (error) {
      console.error("Error creating jewellery:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJewellery = async (data: any) => {
    if (!editingJewellery?.id) return;

    try {
      setLoading(true);
      let availableQty = undefined;
      if (data.available_qty) {
        try {
          availableQty = typeof data.available_qty === "string" ? JSON.parse(data.available_qty) : data.available_qty;
        } catch {
          availableQty = undefined;
        }
      }

      let meta = undefined;
      if (data.meta) {
        try {
          meta = typeof data.meta === "string" ? JSON.parse(data.meta) : data.meta;
        } catch {
          meta = undefined;
        }
      }

      // Use jewelleryImages state for images
      const images = jewelleryImages.map((img) => ({
        image_url: img.image_url,
        order: img.order || 0,
        alt_text: img.alt_text || null,
      }));

      const updateData: any = {};
      if (data.title) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (availableQty !== undefined) updateData.available_qty = availableQty;
      if (data.category) updateData.category = data.category;
      if (data.size) updateData.size = parseFloat(data.size);
      if (data.gender) updateData.gender = data.gender;
      if (data.factor) updateData.factor = parseFloat(data.factor);
      if (meta !== undefined) updateData.meta = meta;
      if (images.length > 0) updateData.images = images;

      const response = await clientApi.updateJewellery(editingJewellery.id.toString(), updateData);

      if (response?.success) {
        toast({
          title: "Success",
          description: response.message || "Jewellery updated successfully",
          variant: "success",
        });
        setDisplayJewelleryModal(false);
        resetJewellery();
        setJewelleryImages([]);
        setEditingJewellery(null);
        fetchJewellery();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update jewellery",
        });
      }
    } catch (error) {
      console.error("Error updating jewellery:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJewellery = async (id: string) => {
    if (!confirm("Are you sure you want to delete this jewellery?")) return;

    try {
      setLoading(true);
      const response = await clientApi.deleteJewellery(id);

      if (response?.success) {
        toast({
          title: "Success",
          description: response.message || "Jewellery deleted successfully",
          variant: "success",
        });
        fetchJewellery();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete jewellery",
        });
      }
    } catch (error) {
      console.error("Error deleting jewellery:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (data: any) => {
    try {
      setLoading(true);
      const categoryData = {
        category_name: data.category_name,
        metal: data.metal,
        category_logo: data.category_logo || null,
      };

      const response = await clientApi.createCategory(categoryData);

      if (response?.success) {
        toast({
          title: "Success",
          description: response.message || "Category created successfully",
          variant: "success",
        });
        setDisplayCategoryModal(false);
        resetCategory();
        setEditingCategory(null);
        // fetchCategories();
        // Refresh categories by metal type if the new category matches current metal type
        if (data.metal === metalType) {
          fetchCategoriesByMetalType(metalType);
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create category",
        });
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (data: any) => {
    if (!editingCategory?.id) return;

    try {
      setLoading(true);
      const updateData: any = {};
      if (data.category_name) updateData.category_name = data.category_name;
      if (data.metal) updateData.metal = data.metal;
      if (data.category_logo !== undefined) updateData.category_logo = data.category_logo;

      const response = await clientApi.updateCategory(editingCategory.id.toString(), updateData);

      if (response?.success) {
        toast({
          title: "Success",
          description: response.message || "Category updated successfully",
          variant: "success",
        });
        setDisplayCategoryModal(false);
        resetCategory();
        setEditingCategory(null);
        // fetchCategories();
        // Refresh categories by metal type
        fetchCategoriesByMetalType(metalType);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update category",
        });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const openJewelleryModal = (jewellery?: any) => {
    if (jewellery) {
      setEditingJewellery(jewellery);
      // Determine metal type from category or default to current metalType
      const category = categories.find((cat) => cat.category_name === jewellery.category);
      const metal = category?.metal || metalType;
      setJewelleryMetalType(metal);
      fetchCategoriesByMetalType(metal);

      setValueJewellery("title", jewellery.title || "");
      setValueJewellery("description", jewellery.description || "");
      setValueJewellery("available_qty", jewellery.available_qty ? JSON.stringify(jewellery.available_qty) : "");
      setValueJewellery("category", jewellery.category || "");
      setValueJewellery("size", jewellery.size || "");
      setValueJewellery("gender", jewellery.gender || "UNISEX");
      setValueJewellery("factor", jewellery.factor || "");
      setValueJewellery("meta", jewellery.meta ? JSON.stringify(jewellery.meta) : "");

      // Load existing images
      if (jewellery.images && Array.isArray(jewellery.images)) {
        setJewelleryImages(
          jewellery.images.map((img: any) => ({
            image_url: img.image_url || img.url || "",
            order: img.order || 0,
            alt_text: img.alt_text || img.alt || "",
          }))
        );
      } else {
        setJewelleryImages([]);
      }
    } else {
      setEditingJewellery(null);
      setJewelleryMetalType(metalType);
      fetchCategoriesByMetalType(metalType);
      resetJewellery();
      setJewelleryImages([]);
    }
    setDisplayJewelleryModal(true);
  };

  const openCategoryModal = (category?: any) => {
    if (category) {
      setEditingCategory(category);
      resetCategory({
        category_name: category.category_name || "",
        metal: category.metal || "",
        category_logo: category.category_logo || "",
      });
    } else {
      setEditingCategory(null);
      resetCategory();
    }
    setDisplayCategoryModal(true);
  };

  const jewelleryColumns = [
    {
      key: "id",
      dataIndex: "id",
      title: "ID",
    },
    {
      key: "title",
      dataIndex: "title",
      title: "Title",
    },
    {
      key: "description",
      dataIndex: "description",
      title: "Description",
      render: (text: string) => (text ? (text.length > 50 ? text.substring(0, 50) + "..." : text) : "-"),
    },
    {
      key: "category",
      dataIndex: "category",
      title: "Category",
    },
    {
      key: "size",
      dataIndex: "size",
      title: "Size",
      render: (size: number) => (size ? size.toString() : "-"),
    },
    {
      key: "gender",
      dataIndex: "gender",
      title: "Gender",
    },
    {
      key: "available_qty",
      dataIndex: "available_qty",
      title: "Available Qty",
      render: (qty: Record<string, number>) => (qty ? JSON.stringify(qty) : "-"),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <button onClick={() => openJewelleryModal(record)} className="text-blue-600 hover:text-blue-800">
            Edit
          </button>
          <button
            onClick={() => handleDeleteJewellery(record.id.toString())}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const categoryColumns = [
    {
      key: "id",
      dataIndex: "id",
      title: "ID",
    },
    {
      key: "category_name",
      dataIndex: "category_name",
      title: "Category Name",
    },
    {
      key: "metal",
      dataIndex: "metal",
      title: "Metal",
    },
    {
      key: "category_logo",
      dataIndex: "category_logo",
      title: "Logo",
      render: (logo: string) =>
        logo ? (
          <a href={logo} target="_blank" rel="noopener noreferrer" className="text-blue-600">
            View
          </a>
        ) : (
          "-"
        ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_: any, record: any) => (
        <button onClick={() => openCategoryModal(record)} className="text-blue-600 hover:text-blue-800">
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jewellery Management</h1>
        <div className="flex gap-4">
          <button
            onClick={() => openJewelleryModal()}
            className="block text-white bg-primary focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            type="button"
          >
            Create Jewellery
          </button>
          <button
            onClick={() => openCategoryModal()}
            className="block text-white bg-primary focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            type="button"
          >
            Create Category
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 border rounded-lg dark:border-gray-700">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Metal Type *</label>
          <select
            value={metalType}
            onChange={(e) => {
              const newMetalType = e.target.value;
              setMetalType(newMetalType);
              setOffset(0); // Reset offset when changing metal type
              setCategoryFilter(""); // Reset category filter
              fetchCategoriesByMetalType(newMetalType); // Fetch categories for new metal type
            }}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Gender</label>
          <select
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value);
              setOffset(0);
            }}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">All</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            {/* <option value="UNISEX">Unisex</option> */}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setOffset(0);
            }}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 min-w-[150px]"
          >
            <option value="">All Categories</option>
            {categoriesByMetalType.map((cat) => (
              <option key={cat.id} value={cat.category_name}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Limit</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setOffset(0);
            }}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={() => {
              setOffset(Math.max(0, offset - limit));
            }}
            disabled={offset === 0}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => {
              setOffset(offset + limit);
            }}
            disabled={jewelleryList.length < limit}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Jewellery Modal */}
      {displayJewelleryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingJewellery ? "Edit Jewellery" : "Create Jewellery"}</h2>
              <button
                onClick={() => {
                  setDisplayJewelleryModal(false);
                  resetJewellery();
                  setJewelleryImages([]);
                  setEditingJewellery(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={
                editingJewellery
                  ? handleSubmitJewellery(handleUpdateJewellery)
                  : handleSubmitJewellery(handleCreateJewellery)
              }
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  {...registerJewellery("title", { required: true })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                {errorsJewellery.title && <p className="text-red-500 text-xs mt-1">Title is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  {...registerJewellery("description")}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Metal Type *</label>
                <select
                  value={jewelleryMetalType}
                  onChange={(e) => {
                    const newMetalType = e.target.value;
                    setJewelleryMetalType(newMetalType);
                    fetchCategoriesByMetalType(newMetalType);
                    setValueJewellery("category", ""); // Reset category when metal type changes
                  }}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 mb-4"
                >
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  {...registerJewellery("category", { required: !editingJewellery })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select Category</option>
                  {categoriesByMetalType.map((cat) => (
                    <option key={cat.id} value={cat.category_name}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
                {errorsJewellery.category && <p className="text-red-500 text-xs mt-1">Category is required</p>}
                {categoriesByMetalType.length === 0 && (
                  <p className="text-yellow-500 text-xs mt-1">
                    No categories available for {jewelleryMetalType}. Please create a category first.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Size</label>
                  <input
                    type="number"
                    step="0.01"
                    {...registerJewellery("size")}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select
                    {...registerJewellery("gender")}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    {/* <option value="UNISEX"></option> */}
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                  </select>
                </div>
              </div>

              {editingJewellery && (
                <div>
                  <label className="block text-sm font-medium mb-1">Factor</label>
                  <input
                    type="number"
                    step="0.01"
                    {...registerJewellery("factor")}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Available Quantity (JSON)</label>
                <textarea
                  {...registerJewellery("available_qty")}
                  placeholder='{"size1": 10, "size2": 5}'
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Meta (JSON)</label>
                <textarea
                  {...registerJewellery("meta")}
                  placeholder='{"key": "value"}'
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Images</label>
                <div className="space-y-3">
                  {jewelleryImages.map((image, index) => (
                    <div key={index} className="p-4 border rounded-lg dark:border-gray-600 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Image {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setJewelleryImages(jewelleryImages.filter((_, i) => i !== index));
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Image URL *</label>
                        <input
                          type="url"
                          value={image.image_url}
                          onChange={(e) => {
                            const updated = [...jewelleryImages];
                            updated[index].image_url = e.target.value;
                            setJewelleryImages(updated);
                          }}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
                          maxLength={500}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">Order</label>
                          <input
                            type="number"
                            value={image.order}
                            onChange={(e) => {
                              const updated = [...jewelleryImages];
                              updated[index].order = parseInt(e.target.value) || 0;
                              setJewelleryImages(updated);
                            }}
                            placeholder="0"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Alt Text</label>
                          <input
                            type="text"
                            value={image.alt_text}
                            onChange={(e) => {
                              const updated = [...jewelleryImages];
                              updated[index].alt_text = e.target.value;
                              setJewelleryImages(updated);
                            }}
                            placeholder="Image description"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
                            maxLength={255}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setJewelleryImages([...jewelleryImages, { image_url: "", order: 0, alt_text: "" }]);
                    }}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    + Add Image
                  </button>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setDisplayJewelleryModal(false);
                    resetJewellery();
                    setJewelleryImages([]);
                    setEditingJewellery(null);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingJewellery ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {displayCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingCategory ? "Edit Category" : "Create Category"}</h2>
              <button
                onClick={() => {
                  setDisplayCategoryModal(false);
                  resetCategory();
                  setEditingCategory(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={
                editingCategory
                  ? handleSubmitCategory(handleUpdateCategory)
                  : handleSubmitCategory(handleCreateCategory)
              }
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Category Name *</label>
                <input
                  {...registerCategory("category_name", { required: !editingCategory })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                {errorsCategory.category_name && <p className="text-red-500 text-xs mt-1">Category name is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Metal *</label>
                <select
                  {...registerCategory("metal", { required: !editingCategory })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select Metal</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                </select>
                {errorsCategory.metal && <p className="text-red-500 text-xs mt-1">Metal is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category Logo URL</label>
                <input
                  {...registerCategory("category_logo")}
                  type="url"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setDisplayCategoryModal(false);
                    resetCategory();
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jewellery Table */}
      <section className="w-full relative overflow-x-auto">
        <div className="mb-4 text-lg font-semibold">Jewellery Items</div>
        <Table
          scroll={{ x: true }}
          className="ant-table-tbody whitespace-pre"
          rootClassName={"table_paginator"}
          columns={jewelleryColumns}
          dataSource={jewelleryList}
          loading={loading}
        />
      </section>

      {/* Categories Table */}
      {/* <section className="w-full relative overflow-x-auto">
        <div className="mb-4 text-lg font-semibold">All Categories</div>
        <Table
          scroll={{ x: true }}
          className="ant-table-tbody whitespace-pre"
          rootClassName={"table_paginator"}
          columns={categoryColumns}
          dataSource={categories}
          loading={loading}
        />
      </section> */}

      {/* Categories by Metal Type Section */}
      <section className="w-full relative overflow-x-auto">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Categories by Metal Type</div>
          <select
            value={metalType}
            onChange={(e) => {
              setMetalType(e.target.value);
              fetchCategoriesByMetalType(e.target.value);
            }}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
          </select>
        </div>
        <Table
          scroll={{ x: true }}
          className="ant-table-tbody whitespace-pre"
          rootClassName={"table_paginator"}
          columns={categoryColumns}
          dataSource={categoriesByMetalType}
          loading={loading}
        />
      </section>
    </div>
  );
}
