import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../../../common/Ui/Button";
import { AlertTriangle, Edit, Plus, Shield, Trash2, X } from "lucide-react";
import { Label } from "../../../../common/Ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../common/Ui/Select";
import { Input } from "../../../../common/Ui/input";
import { Textarea } from "../../../../common/Ui/Textarea";
import { Badge } from "../../../../common/Ui/Badge2";
import { Card } from "../../../../common/Ui/Card2";
import { allergiesService } from "../../../../Services/Patient/allergiesService";

interface AllergiesTabProps {
  data: any[];
}

type Severity = "CRITICAL" | "SEVERE" | "MODERATE" | "MILD";

interface FormData {
  allergen: string;
  severity: Severity; // 👈 restrict to allowed values
  allergyType: string;
  symptoms: string;
  emergencyAction: string;
  notes: string;
  diagnosedDate: string;
  isActive: boolean;
}

export default function AllergiesTab({ data }: AllergiesTabProps) {
  const [allergies, setAllergies] = useState(data || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    allergen: "",
    severity: "MILD",
    allergyType: "",
    symptoms: "",
    emergencyAction: "",
    notes: "",
    diagnosedDate: "",
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requestData = {
        ...formData,
        symptoms: formData.symptoms.split(",").map((s) => s.trim()),
      };

      if (editingAllergy) {
        const updated = await allergiesService.updateAllergy(
          editingAllergy.id,
          requestData
        );
        setAllergies((prev) =>
          prev.map((a) => (a.id === editingAllergy.id ? updated : a))
        );
      } else {
        const newAllergy = await allergiesService.addAllergy(requestData);
        setAllergies((prev) => [...prev, newAllergy]);
      }

      setIsModalOpen(false);
      setEditingAllergy("");
      resetForm();
    } catch (error) {
      console.error("Error saving allergy:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      allergen: "",
      severity: "MILD",
      allergyType: "",
      symptoms: "",
      emergencyAction: "",
      notes: "",
      diagnosedDate: "",
      isActive: true,
    });
  };

  const handleEdit = (allergy: any) => {
    setEditingAllergy(allergy);
    setFormData({
      allergen: allergy.allergen || "",
      severity: allergy.severity || "",
      allergyType: allergy.allergyType || "",
      symptoms: allergy.symptoms?.join(", ") || "",
      emergencyAction: allergy.emergencyAction || "",
      notes: allergy.notes || "",
      diagnosedDate: allergy.diagnosedDate?.split("T")[0] || "",
      isActive: allergy.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (allergyId: string) => {
    try {
      await allergiesService.deleteAllergy(allergyId);
      setAllergies((prev) => prev.filter((a) => a.id !== allergyId));
    } catch (error) {
      console.error("Error deleting allergy:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-500";
      case "SEVERE":
        return "bg-orange-500";
      case "MODERATE":
        return "bg-yellow-500";
      case "MILD":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-orange-500" />
          <h2 className="text-3xl font-bold text-foreground">
            Allergies Management
          </h2>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Allergy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {allergies.map((allergy, index) => (
            <motion.div
              key={allergy.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-500" />
                    <h3 className="font-semibold text-lg text-card-foreground">
                      {allergy.allergen}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(allergy)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(allergy.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${getSeverityColor(
                        allergy.severity
                      )} text-white`}
                    >
                      {allergy.severity}
                    </Badge>
                    <Badge variant="outline">{allergy.allergyType}</Badge>
                  </div>

                  {allergy.symptoms && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Symptoms:
                      </p>
                      <p className="text-sm text-card-foreground">
                        {allergy.formattedSymptoms ||
                          allergy.symptoms?.join(", ")}
                      </p>
                    </div>
                  )}

                  {allergy.emergencyAction && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Emergency Action:
                      </p>
                      <p className="text-sm text-card-foreground">
                        {allergy.emergencyAction}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Diagnosed:{" "}
                    {new Date(allergy.diagnosedDate).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-modal rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {editingAllergy ? "Edit Allergy" : "Add New Allergy"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingAllergy("");
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="allergen">Allergen *</Label>
                  <Input
                    id="allergen"
                    value={formData.allergen}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        allergen: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="severity">Severity *</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        severity: value as Severity,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MILD">Mild</SelectItem>
                      <SelectItem value="MODERATE">Moderate</SelectItem>
                      <SelectItem value="SEVERE">Severe</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="allergyType">Allergy Type</Label>
                  <Select
                    value={formData.allergyType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, allergyType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Drug">Drug</SelectItem>
                      <SelectItem value="Environmental">
                        Environmental
                      </SelectItem>
                      <SelectItem value="Insect">Insect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="symptoms">Symptoms (comma-separated)</Label>
                  <Input
                    id="symptoms"
                    value={formData.symptoms}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        symptoms: e.target.value,
                      }))
                    }
                    placeholder="e.g., Hives, Swelling, Difficulty breathing"
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyAction">Emergency Action</Label>
                  <Textarea
                    id="emergencyAction"
                    value={formData.emergencyAction}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        emergencyAction: e.target.value,
                      }))
                    }
                    placeholder="What to do in case of exposure"
                  />
                </div>

                <div>
                  <Label htmlFor="diagnosedDate">Diagnosed Date</Label>
                  <Input
                    id="diagnosedDate"
                    type="date"
                    value={formData.diagnosedDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        diagnosedDate: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Additional notes"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {editingAllergy ? "Update" : "Add"} Allergy
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingAllergy("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
