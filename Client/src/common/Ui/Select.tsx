import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../utils/cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  label,
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <motion.label
          className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-300"
          layoutId={`select-label-${label}`}
        >
          {label}
        </motion.label>
      )}
      <div className="relative" ref={selectRef}>
        <motion.button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl",
            "focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none",
            "transition-all duration-300 hover:border-blue-300 hover:shadow-lg",
            "text-left flex items-center justify-between",
            "shadow-sm hover:shadow-md focus:shadow-xl",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          animate={{
            borderColor: isOpen ? "#60a5fa" : undefined,
          }}
        >
          <span
            className={cn(
              "truncate",
              selectedOption ? "text-slate-700" : "text-slate-400"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border-2 border-blue-100 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <motion.div className="py-2">
                {options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200",
                      "flex items-center justify-between group/item",
                      value === option.value &&
                        "bg-blue-50 text-blue-600 font-semibold"
                    )}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      x: 4,
                    }}
                  >
                    <span>{option.label}</span>
                    {value === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <Check className="w-4 h-4 text-blue-600" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Select;
