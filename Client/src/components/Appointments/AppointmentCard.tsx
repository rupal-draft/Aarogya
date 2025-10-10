import type React from "react";
import type { AppointmentResponseDto } from "../../types/appointment";
import { AppointmentStatus } from "../../Data/enums/Appointment";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  IndianRupee,
  FileText,
  CreditCard,
  Eye,
  EyeOff,
  Award,
} from "lucide-react";
import { useState } from "react";
import { paymentService } from "../../Services/payment";
import { PaymentModal } from "../Payment/AppointmentPaymentModal";

interface AppointmentCardProps {
  appointment: AppointmentResponseDto;
  index: number;
  refresh: () => Promise<void>;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  index,
  refresh,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loadingPaymentDetails, setLoadingPaymentDetails] = useState(false);
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case AppointmentStatus.CONFIRMED:
        return "bg-green-100 text-green-800 border-green-200";
      case AppointmentStatus.CANCELLED:
        return "bg-red-100 text-red-800 border-red-200";
      case AppointmentStatus.COMPLETED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return Clock;
      case AppointmentStatus.CONFIRMED:
        return CheckCircle;
      case AppointmentStatus.CANCELLED:
        return XCircle;
      case AppointmentStatus.COMPLETED:
        return CheckCircle;
      default:
        return Calendar;
    }
  };

  const isPaymentRequired = () => {
    return (
      appointment.status === AppointmentStatus.PENDING &&
      (!appointment.paymentId || appointment.paymentId === "Not paid yet")
    );
  };

  const isPaid = () => {
    return appointment.paymentId && appointment.paymentId !== "Not paid yet";
  };

  const handlePaymentSuccess = async (details: any) => {
    setPaymentDetails(details);
    setShowPaymentModal(false);
    await refresh();
    await loadPaymentDetails();
  };

  const handlePaymentFailure = (error: string) => {
    console.error("Payment failed:", error);
  };

  const loadPaymentDetails = async () => {
    if (!appointment.paymentId || appointment.paymentId === "Not paid yet")
      return;

    try {
      setLoadingPaymentDetails(true);
      const details = await paymentService.getPaymentDetails(
        appointment.paymentId
      );
      setPaymentDetails(details);
      setShowPaymentDetails(true);
    } catch (error) {
      console.error("Failed to load payment details:", error);
    } finally {
      setLoadingPaymentDetails(false);
    }
  };

  const StatusIcon = getStatusIcon(appointment.status);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={{
          scale: 1.02,
          y: -5,
          transition: { duration: 0.2 },
        }}
        className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
      >
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6">
          {/* Floating background elements */}
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full"
          />

          <div className="relative z-10 flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <StatusIcon className="w-5 h-5" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">
                    Dr. {appointment.doctor.firstName}{" "}
                    {appointment.doctor.lastName}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {appointment.doctor.specialization}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-blue-100">
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>{appointment.doctor.experienceYears} years</span>
                </div>
                {appointment.isVirtual && (
                  <div className="flex items-center space-x-1">
                    <Video className="w-4 h-4" />
                    <span>Virtual</span>
                  </div>
                )}
              </div>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                appointment.status
              )}`}
            >
              {appointment.status}
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Appointment Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 rounded-2xl p-4 space-y-3"
            >
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                Appointment Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date(appointment.appointmentDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {appointment.startTime} - {appointment.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">
                    {appointment.type.toLowerCase()}
                  </span>
                </div>
                {appointment.priority && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span
                      className={`font-medium ${
                        appointment.priority > 3
                          ? "text-red-600"
                          : appointment.priority > 1
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {appointment.priority > 3
                        ? "High"
                        : appointment.priority > 1
                        ? "Medium"
                        : "Low"}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 rounded-2xl p-4 space-y-3"
            >
              <h4 className="font-semibold text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-2 text-purple-500" />
                Doctor Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">License:</span>
                  <span className="font-mono text-xs">
                    {appointment.doctor.licenseNumber}
                  </span>
                </div>
                {appointment.doctor.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">
                      {appointment.doctor.phone}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee:</span>
                  <span className="font-bold text-green-600 flex items-center">
                    <IndianRupee className="w-3 h-3" />
                    {appointment.doctor.consultationFee}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Reason and Symptoms */}
          {(appointment.reason || appointment.symptoms?.length) && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-blue-50 rounded-2xl p-4 space-y-3"
            >
              <h4 className="font-semibold text-gray-900 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-green-500" />
                Medical Information
              </h4>
              {appointment.reason && (
                <div>
                  <span className="text-sm text-gray-600 block mb-1">
                    Reason:
                  </span>
                  <p className="text-sm font-medium text-gray-800">
                    {appointment.reason}
                  </p>
                </div>
              )}
              {appointment.symptoms?.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600 block mb-2">
                    Symptoms:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {appointment.symptoms.map((symptom, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                      >
                        {symptom}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Payment Section */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-100"
          >
            <h4 className="font-semibold text-gray-900 flex items-center mb-3">
              <CreditCard className="w-4 h-4 mr-2 text-green-500" />
              Payment Information
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Consultation Fee:</span>
                <span className="font-bold text-xl text-green-600 flex items-center">
                  <IndianRupee className="w-4 h-4" />
                  {appointment.doctor.consultationFee}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment Status:</span>
                <div className="flex items-center space-x-2">
                  {isPaid() ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Paid</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center space-x-1">
                      <XCircle className="w-3 h-3" />
                      <span>Pending</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Payment Actions */}
              <div className="flex space-x-3 pt-2">
                {isPaymentRequired() && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPaymentModal(true)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Now</span>
                  </motion.button>
                )}

                {isPaid() && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadPaymentDetails}
                    disabled={loadingPaymentDetails}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {loadingPaymentDetails ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    <span>
                      {loadingPaymentDetails ? "Loading..." : "View Receipt"}
                    </span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Notes */}
          {(appointment.notes || appointment.doctorNotes) && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-yellow-50 rounded-2xl p-4 space-y-3 border border-yellow-100"
            >
              <h4 className="font-semibold text-gray-900 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-yellow-500" />
                Notes
              </h4>
              {appointment.notes && (
                <div>
                  <span className="text-sm text-gray-600 block mb-1">
                    Patient Notes:
                  </span>
                  <p className="text-sm text-gray-800">{appointment.notes}</p>
                </div>
              )}
              {appointment.doctorNotes && (
                <div>
                  <span className="text-sm text-gray-600 block mb-1">
                    Doctor Notes:
                  </span>
                  <p className="text-sm text-gray-800">
                    {appointment.doctorNotes}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Meeting Link */}
          {appointment.isVirtual && appointment.meetingLink && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-purple-50 rounded-2xl p-4 border border-purple-100"
            >
              <h4 className="font-semibold text-gray-900 flex items-center mb-3">
                <Video className="w-4 h-4 mr-2 text-purple-500" />
                Virtual Meeting
              </h4>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={appointment.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200 font-semibold"
              >
                <Video className="w-4 h-4" />
                <span>Join Meeting</span>
              </motion.a>
            </motion.div>
          )}

          {/* Cancellation Reason */}
          {appointment.status === AppointmentStatus.CANCELLED &&
            appointment.cancellationReason && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 rounded-2xl p-4 border border-red-100"
              >
                <h4 className="font-semibold text-gray-900 flex items-center mb-2">
                  <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                  Cancellation Reason
                </h4>
                <p className="text-sm text-gray-800">
                  {appointment.cancellationReason}
                </p>
              </motion.div>
            )}
        </div>
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        appointment={appointment}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />

      {/* Payment Details Modal */}
      <AnimatePresence>
        {showPaymentDetails && paymentDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setShowPaymentDetails(false)
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPaymentDetails(false)}
                  className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <EyeOff className="w-4 h-4" />
                </motion.button>

                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <FileText className="w-8 h-8" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2">Payment Receipt</h2>
                  <p className="text-green-100">Transaction Details</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Payment Status */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-green-600 mb-1">
                    Payment Successful
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Transaction completed successfully
                  </p>
                </div>

                {/* Payment Details */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                    <h4 className="font-semibold text-gray-900">
                      Transaction Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-mono text-xs break-all">
                          {paymentDetails.razorpayPaymentId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-mono text-xs break-all">
                          {paymentDetails.razorpayOrderId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold text-green-600 flex items-center">
                          <IndianRupee className="w-3 h-3" />
                          {paymentDetails.amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-green-600">
                          {paymentDetails.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Date:</span>
                        <span className="font-medium">
                          {paymentDetails.paidAt
                            ? new Date(
                                paymentDetails.paidAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Just now"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="bg-blue-50 rounded-2xl p-4 space-y-3">
                    <h4 className="font-semibold text-gray-900">
                      Appointment Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doctor:</span>
                        <span className="font-medium">
                          Dr. {appointment.doctor.firstName}{" "}
                          {appointment.doctor.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">
                          {appointment.startTime} - {appointment.endTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPaymentDetails(false)}
                  className="w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppointmentCard;
