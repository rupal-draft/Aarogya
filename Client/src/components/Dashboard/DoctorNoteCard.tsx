import { motion } from "framer-motion";
import { FileText, Calendar } from "lucide-react";
import GlassCard from "../../common/Cards/GlassCard";

const DoctorNoteCard = ({ note }: { note: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    <GlassCard className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-200 rounded-lg">
            <FileText className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{note.noteType}</h3>
            <p className="text-sm text-gray-600">Dr. {note.doctorName}</p>
          </div>
        </div>
        {note.followUpRequired && (
          <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full font-medium">
            Follow-up Required
          </span>
        )}
      </div>

      <p className="text-gray-700 text-sm mb-3 leading-relaxed line-clamp-3">
        {note.content}
      </p>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Calendar className="w-4 h-4 text-emerald-600" />
        {new Date(note.formattedCreatedAt).toLocaleDateString()}
      </div>
    </GlassCard>
  </motion.div>
);

export default DoctorNoteCard;
