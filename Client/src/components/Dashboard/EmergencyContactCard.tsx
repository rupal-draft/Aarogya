import { motion } from "framer-motion";
import { Users, Phone, Mail, MapPin } from "lucide-react";
import GlassCard from "../../common/Cards/GlassCard";

const EmergencyContactCard = ({ contact }: { contact: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    <GlassCard className="p-6 bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              contact.isPrimary ? "bg-orange-200" : "bg-amber-100"
            }`}
          >
            <Users
              className={`w-5 h-5 ${
                contact.isPrimary ? "text-orange-700" : "text-amber-600"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {contact.contactName}
            </h3>
            <p className="text-sm text-gray-600">{contact.relationship}</p>
          </div>
        </div>
        {contact.isPrimary && (
          <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded-full font-medium">
            Primary
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-orange-500" />
          <span>{contact.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-orange-500" />
          <span className="truncate">{contact.email}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
          <span className="text-xs">{contact.address}</span>
        </div>
      </div>
    </GlassCard>
  </motion.div>
);

export default EmergencyContactCard;
