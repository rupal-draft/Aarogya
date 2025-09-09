import { motion } from "framer-motion";

export const EnhancedLineChart = ({
  data,
  color,
  title,
}: {
  data: { label: string; value: number }[];
  color: string;
  title?: string;
}) => {
  const maxValue = Math.max(...data.map((item) => item.value));
  const minValue = Math.min(...data.map((item) => item.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="relative">
      {title && (
        <h4 className="text-sm font-semibold text-gray-800 mb-3">{title}</h4>
      )}
      <div className="h-20 relative">
        <svg width="100%" height="100%" className="overflow-visible">
          {data.length === 1 ? (
            <motion.circle
              cx="50%"
              cy="50%"
              r="4"
              fill={color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <motion.polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={data
                .map((item, i) => {
                  const x = (i / (data.length - 1)) * 100;
                  const y =
                    100 - (((item.value - minValue) / range) * 100 || 0);
                  return `${x},${y}`;
                })
                .join(" ")}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
          )}
        </svg>

        {/* Data points */}
        {data.map((item, i) => (
          <motion.circle
            key={i}
            cx={`${(i / (data.length - 1)) * 100}%`}
            cy={`${100 - (((item.value - minValue) / range) * 100 || 0)}%`}
            r="3"
            fill={color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.2, type: "spring" }}
            whileHover={{ scale: 1.5 }}
            className="cursor-pointer"
          />
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-600 mt-2">
        {data.map((item, i) => (
          <span
            key={i}
            className="truncate"
            style={{ width: `${100 / data.length}%` }}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};
