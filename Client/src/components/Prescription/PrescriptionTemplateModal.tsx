import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Search,
  Star,
  Share2,
  Copy,
  Play,
  Filter,
  Grid,
  List,
  Zap,
  BarChart3,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  Sparkles,
  Edit,
  Trash2,
  Folder,
  Calendar,
  Activity,
  FileText,
  Pill,
} from "lucide-react";
import type {
  CreateTemplateRequest,
  TemplateResponse,
  CategoryResponse,
  TemplateStatsResponse,
  TemplateSearchSuggestion,
  ApplyTemplateRequest,
  DuplicateTemplateRequest,
  CreateCategoryRequest,
} from "../../types/prescription";
import { prescriptionTemplateService } from "../../Services/prescription";
import TemplateDetailsModal from "./TemplateDetailsModal";

interface PrescriptionTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: () => void;
  patientId?: string;
  appointmentId?: string;
}

const PrescriptionTemplateModal: React.FC<PrescriptionTemplateModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
  patientId,
  appointmentId,
}) => {
  const [activeTab, setActiveTab] = useState<
    "browse" | "create" | "stats" | "categories"
  >("browse");
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateResponse | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [stats, setStats] = useState<TemplateStatsResponse | null>(null);
  const [suggestions, setSuggestions] =
    useState<TemplateSearchSuggestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<TemplateResponse | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  // Form states
  const [formData, setFormData] = useState<CreateTemplateRequest>({
    name: "",
    description: "",
    diagnosis: "",
    notes: "",
    medicines: [],
    tags: [],
    applicableConditions: [],
    isFavorite: false,
    isShared: false,
    categoryId: "",
  });

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [templatesRes, categoriesRes, statsRes, suggestionsRes] =
        await Promise.all([
          prescriptionTemplateService.getTemplates({}),
          prescriptionTemplateService.getCategories(),
          prescriptionTemplateService.getTemplateStats(),
          prescriptionTemplateService.getTemplateSuggestions(),
        ]);

      setTemplates(templatesRes.content);
      setCategories(categoriesRes);
      setStats(statsRes);
      setSuggestions(suggestionsRes);
    } catch (error) {
      console.error("Error loading template data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Template CRUD Operations
  const handleCreateTemplate = async () => {
    try {
      setIsCreating(true);
      await prescriptionTemplateService.createTemplate(formData);
      await loadInitialData();
      setActiveTab("browse");
      resetForm();
    } catch (error) {
      console.error("Error creating template:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;

    try {
      setIsCreating(true);
      await prescriptionTemplateService.updateTemplate(
        editingTemplate.id,
        formData
      );
      await loadInitialData();
      setActiveTab("browse");
      resetForm();
      setIsEditing(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error("Error updating template:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      await prescriptionTemplateService.deleteTemplate(templateId);
      await loadInitialData();
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const handleDuplicateTemplate = async (template: TemplateResponse) => {
    try {
      const duplicateRequest: DuplicateTemplateRequest = {
        newName: `${template.name} (Copy)`,
        newDescription: template.description,
      };
      await prescriptionTemplateService.duplicateTemplate(
        template.id,
        duplicateRequest
      );
      await loadInitialData();
    } catch (error) {
      console.error("Error duplicating template:", error);
    }
  };

  const handleApplyTemplate = async (template: TemplateResponse) => {
    try {
      const fullTemplate = await prescriptionTemplateService.getTemplate(
        template.id
      );

      // Create apply request
      const applyRequest: ApplyTemplateRequest = {
        templateId: template.id,
        patientId,
        appointmentId,
        diagnosis: fullTemplate.diagnosis,
        notes: fullTemplate.notes,
        medicineOverrides: fullTemplate.medicines,
        trackUsage: true,
      };

      await prescriptionTemplateService.applyTemplate(applyRequest);
      onApplyTemplate();
      onClose();
    } catch (error) {
      console.error("Error applying template:", error);
    }
  };

  const handleToggleFavorite = async (templateId: string) => {
    try {
      await prescriptionTemplateService.toggleFavorite(templateId);
      await loadInitialData();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Category Operations
  const handleCreateCategory = async () => {
    try {
      const createRequest: CreateCategoryRequest = {
        name: newCategory.name,
        description: newCategory.description,
      };
      await prescriptionTemplateService.createCategory(createRequest);
      await loadInitialData();
      setNewCategory({ name: "", description: "" });
      setShowCategoryForm(false);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await prescriptionTemplateService.deleteCategory(categoryId);
      await loadInitialData();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // View Template Details
  const handleViewTemplate = async (template: TemplateResponse) => {
    try {
      const fullTemplate = await prescriptionTemplateService.getTemplate(
        template.id
      );
      setSelectedTemplate(fullTemplate);
      setShowTemplateDetails(true);
    } catch (error) {
      console.error("Error loading template details:", error);
    }
  };

  // Edit Template
  const handleEditTemplate = async (template: TemplateResponse) => {
    try {
      const fullTemplate = await prescriptionTemplateService.getTemplate(
        template.id
      );
      setEditingTemplate(fullTemplate);
      setFormData({
        name: fullTemplate.name,
        description: fullTemplate.description || "",
        diagnosis: fullTemplate.diagnosis,
        notes: fullTemplate.notes || "",
        medicines: fullTemplate.medicines,
        tags: fullTemplate.tags,
        applicableConditions: fullTemplate.applicableConditions,
        isFavorite: fullTemplate.isFavorite,
        isShared: fullTemplate.isShared,
        categoryId: fullTemplate.categoryId || "",
      });
      setIsEditing(true);
      setActiveTab("create");
      setShowTemplateDetails(false);
    } catch (error) {
      console.error("Error loading template for editing:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      diagnosis: "",
      notes: "",
      medicines: [],
      tags: [],
      applicableConditions: [],
      isFavorite: false,
      isShared: false,
      categoryId: "",
    });
  };

  // Filter templates based on search and filters
  const filteredTemplates = templates?.filter((template) => {
    const matchesSearch =
      searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "" || template.tags.includes(selectedCategory);
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => template.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesTags;
  });
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  if (!isOpen) return null;

  return (
    <React.Fragment>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white p-8">
            <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                    Prescription Templates
                  </h2>
                  <p className="text-blue-100 text-lg">
                    Save time with pre-configured prescription templates
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-white/10 rounded-2xl p-1 backdrop-blur-sm">
                {[
                  { id: "browse", label: "Browse Templates", icon: Grid },
                  {
                    id: "create",
                    label: isEditing ? "Edit Template" : "Create Template",
                    icon: Plus,
                  },
                  { id: "categories", label: "Categories", icon: Folder },
                  { id: "stats", label: "Statistics", icon: BarChart3 },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (tab.id !== "create") {
                        setIsEditing(false);
                        setEditingTemplate(null);
                        resetForm();
                      }
                      setActiveTab(tab.id as any);
                    }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? "bg-white text-blue-600 shadow-lg"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 max-h-[calc(95vh-200px)] overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === "browse" && (
                <motion.div
                  key="browse"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Search and Filters */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                      <div className="relative flex-1 max-w-2xl">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search templates by name, diagnosis, or tags..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                        />
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowFilters(!showFilters)}
                          className="flex items-center gap-2 px-4 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
                        >
                          <Filter className="w-4 h-4" />
                          Filters
                          {showFilters ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setViewMode(viewMode === "grid" ? "list" : "grid")
                          }
                          className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          {viewMode === "grid" ? (
                            <List className="w-4 h-4" />
                          ) : (
                            <Grid className="w-4 h-4" />
                          )}
                          {viewMode === "grid" ? "List" : "Grid"}
                        </motion.button>
                      </div>
                    </div>

                    {/* Expanded Filters */}
                    <AnimatePresence>
                      {showFilters && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categories
                              </label>
                              <select
                                value={selectedCategory}
                                onChange={(e) =>
                                  setSelectedCategory(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.name} ({category.templateCount})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {suggestions?.tagSuggestions
                                  .slice(0, 5)
                                  .map((tag) => (
                                    <button
                                      key={tag}
                                      onClick={() =>
                                        setSelectedTags((prev) =>
                                          prev.includes(tag)
                                            ? prev.filter((t) => t !== tag)
                                            : [...prev, tag]
                                        )
                                      }
                                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                                        selectedTags.includes(tag)
                                          ? "bg-blue-500 text-white shadow-md"
                                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                      }`}
                                    >
                                      {tag}
                                    </button>
                                  ))}
                              </div>
                            </div>

                            <div className="flex items-end gap-2">
                              <button
                                onClick={loadInitialData}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Apply Filters
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedTags([]);
                                  setSelectedCategory("");
                                  setSearchQuery("");
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Templates Grid/List */}
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                      />
                    </div>
                  ) : (
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                          : "space-y-4"
                      }
                    >
                      {filteredTemplates &&
                        filteredTemplates.map((template, index) => (
                          <motion.div
                            key={template.id}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            variants={cardVariants}
                            className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all ${
                              viewMode === "grid" ? "p-6" : "p-4"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-900 mb-1 flex items-center gap-2">
                                  {template.name}
                                  {template.isFavorite && (
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  )}
                                  {template.isShared && (
                                    <Share2 className="w-4 h-4 text-blue-500" />
                                  )}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                  {template.description || template.diagnosis}
                                </p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  handleToggleFavorite(template.id)
                                }
                                className={`p-2 rounded-full ${
                                  template.isFavorite
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-500"
                                }`}
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    template.isFavorite ? "fill-current" : ""
                                  }`}
                                />
                              </motion.button>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4" />
                                <span>{template.usageCount} uses</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Pill className="w-4 h-4" />
                                <span>
                                  {template.medicines?.length} medicines
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {new Date(
                                    template.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {template.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {template.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {template.tags.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{template.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleApplyTemplate(template)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                              >
                                <Play className="w-4 h-4" />
                                Apply
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleViewTemplate(template)}
                                className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleEditTemplate(template)}
                                className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                            </div>

                            <div className="flex gap-2 mt-3">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleDuplicateTemplate(template)
                                }
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                              >
                                <Copy className="w-3 h-3" />
                                Duplicate
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleDeleteTemplate(template.id)
                                }
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  )}

                  {filteredTemplates &&
                    filteredTemplates.length === 0 &&
                    !loading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                      >
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No Templates Found
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {searchQuery ||
                          selectedTags.length > 0 ||
                          selectedCategory
                            ? "Try adjusting your search criteria"
                            : "No templates available. Create your first template!"}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveTab("create")}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Template
                        </motion.button>
                      </motion.div>
                    )}
                </motion.div>
              )}

              {activeTab === "create" && (
                <motion.div
                  key="create"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="max-w-4xl mx-auto"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Plus className="w-6 h-6 text-blue-500" />
                      {isEditing ? "Edit Template" : "Create New Template"}
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Template Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="e.g., Common Cold Treatment"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={formData.categoryId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              categoryId: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          placeholder="Brief description of this template..."
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Diagnosis *
                        </label>
                        <textarea
                          value={formData.diagnosis}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              diagnosis: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          placeholder="Primary diagnosis or condition..."
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              notes: e.target.value,
                            })
                          }
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          placeholder="Additional notes..."
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags
                        </label>
                        <input
                          type="text"
                          value={formData.tags?.join(", ")}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tags: e.target.value
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter(Boolean),
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Separate tags with commas..."
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Applicable Conditions
                        </label>
                        <input
                          type="text"
                          value={formData.applicableConditions?.join(", ")}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              applicableConditions: e.target.value
                                .split(",")
                                .map((condition) => condition.trim())
                                .filter(Boolean),
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Separate conditions with commas..."
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.isFavorite}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isFavorite: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Favorite
                          </span>
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.isShared}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isShared: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Share with team
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setActiveTab("browse");
                          setIsEditing(false);
                          setEditingTemplate(null);
                          resetForm();
                        }}
                        className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={
                          isEditing
                            ? handleUpdateTemplate
                            : handleCreateTemplate
                        }
                        disabled={
                          !formData.name || !formData.diagnosis || isCreating
                        }
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg"
                      >
                        {isCreating ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            {isEditing ? "Updating..." : "Creating..."}
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            {isEditing ? "Update Template" : "Create Template"}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "categories" && (
                <motion.div
                  key="categories"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="max-w-4xl mx-auto"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Folder className="w-6 h-6 text-blue-500" />
                        Template Categories
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCategoryForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        New Category
                      </motion.button>
                    </div>

                    {/* Category Form */}
                    <AnimatePresence>
                      {showCategoryForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
                        >
                          <h4 className="font-semibold text-gray-900 mb-4">
                            Create New Category
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category Name *
                              </label>
                              <input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) =>
                                  setNewCategory({
                                    ...newCategory,
                                    name: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter category name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                              </label>
                              <input
                                type="text"
                                value={newCategory.description}
                                onChange={(e) =>
                                  setNewCategory({
                                    ...newCategory,
                                    description: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter description"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleCreateCategory}
                              disabled={!newCategory.name}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Create Category
                            </button>
                            <button
                              onClick={() => {
                                setShowCategoryForm(false);
                                setNewCategory({ name: "", description: "" });
                              }}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Categories List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map((category) => (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {category.name}
                              </h4>
                              {category.description && (
                                <p className="text-gray-600 text-sm mt-1">
                                  {category.description}
                                </p>
                              )}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteCategory(category.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{category.templateCount} templates</span>
                            <span>
                              {new Date(
                                category.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {categories.length === 0 && (
                      <div className="text-center py-8">
                        <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">
                          No categories created yet.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "stats" && (
                <motion.div
                  key="stats"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="max-w-6xl mx-auto"
                >
                  {stats && (
                    <div className="space-y-6">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                          {
                            label: "Total Templates",
                            value: stats.totalTemplates,
                            icon: FileText,
                            color: "blue",
                          },
                          {
                            label: "Favorites",
                            value: stats.favoriteTemplates,
                            icon: Star,
                            color: "yellow",
                          },
                          {
                            label: "Shared",
                            value: stats.sharedTemplates,
                            icon: Share2,
                            color: "green",
                          },
                          {
                            label: "Total Usage",
                            value: stats.totalUsageCount,
                            icon: Zap,
                            color: "purple",
                          },
                          {
                            label: "This Month",
                            value: stats.usageThisMonth,
                            icon: Calendar,
                            color: "indigo",
                          },
                          {
                            label: "This Week",
                            value: stats.usageThisWeek,
                            icon: Activity,
                            color: "pink",
                          },
                        ].map((stat, index) => (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                  {stat.label}
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                  {stat.value}
                                </p>
                              </div>
                              <div
                                className={`p-3 bg-${stat.color}-100 rounded-xl`}
                              >
                                <stat.icon
                                  className={`w-6 h-6 text-${stat.color}-600`}
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Most Used Templates */}
                      {stats.mostUsedTemplates &&
                        Object.keys(stats.mostUsedTemplates).length > 0 && (
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <Zap className="w-5 h-5 text-yellow-500" />
                              Most Used Templates
                            </h3>
                            <div className="space-y-3">
                              {Object.entries(stats.mostUsedTemplates)
                                .slice(0, 5)
                                .map(([templateName, usageCount], index) => (
                                  <motion.div
                                    key={templateName}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  >
                                    <span className="font-medium text-gray-900">
                                      {templateName}
                                    </span>
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                                      {usageCount} uses
                                    </span>
                                  </motion.div>
                                ))}
                            </div>
                          </div>
                        )}

                      {/* Category Usage */}
                      {stats.categoryUsage &&
                        Object.keys(stats.categoryUsage).length > 0 && (
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <Folder className="w-5 h-5 text-green-500" />
                              Category Usage
                            </h3>
                            <div className="space-y-3">
                              {Object.entries(stats.categoryUsage)
                                .slice(0, 5)
                                .map(([categoryName, usageCount], index) => (
                                  <motion.div
                                    key={categoryName}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  >
                                    <span className="font-medium text-gray-900">
                                      {categoryName}
                                    </span>
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                                      {usageCount} uses
                                    </span>
                                  </motion.div>
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showTemplateDetails && selectedTemplate && (
          <TemplateDetailsModal
            template={selectedTemplate}
            onClose={() => {
              setShowTemplateDetails(false);
              setSelectedTemplate(null);
            }}
            onEdit={() => handleEditTemplate(selectedTemplate)}
            onApply={() => handleApplyTemplate(selectedTemplate)}
          />
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default PrescriptionTemplateModal;
