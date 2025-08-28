"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Pill, Clock } from "lucide-react";
import Button from "../../../../common/Ui/Button";
import { Card } from "../../../../common/Ui/Card2";
import { Badge } from "../../../../common/Ui/Badge2";

interface MedicationsTabProps {
  data: any[];
}

export default function MedicationsTab({ data }: MedicationsTabProps) {
  const [medications, setMedications] = useState(data || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<any>(null);
  const [formData, setFormData] = useState({
    medicationName: "",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
    prescribedBy: "",
    status: "ACTIVE",
    notes: "",
    reason: "",
    instructions: "",
    sideEffects: "",
    reminderEnabled: true,
  });

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-500";
      case "COMPLETED":
        return "bg-blue-500";
      case "DISCONTINUED":
        return "bg-red-500";
      case "PAUSED":
        return "bg-yellow-500";
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
          <Pill className="w-8 h-8 text-green-500" />
          <h2 className="text-3xl font-bold text-foreground">
            Medications Management
          </h2>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {medications.map((medication, index) => (
            <motion.div
              key={medication.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-lg text-card-foreground">
                      {medication.medicationName}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 bg-transparent"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${getStatusColor(
                        medication.status
                      )} text-white`}
                    >
                      {medication.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {medication.frequency}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Dosage:
                    </p>
                    <p className="text-sm text-card-foreground">
                      {medication.dosage}
                    </p>
                  </div>

                  {medication.reason && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Purpose:
                      </p>
                      <p className="text-sm text-card-foreground">
                        {medication.reason}
                      </p>
                    </div>
                  )}

                  {medication.prescribedBy && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Prescribed by:
                      </p>
                      <p className="text-sm text-card-foreground">
                        {medication.prescribedBy}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Started:{" "}
                    {new Date(medication.startDate).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
