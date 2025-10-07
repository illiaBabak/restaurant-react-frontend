import { JSX } from "react";
import { AlertProps } from "src/types";
import { CheckCircle, XCircle, X } from "lucide-react";
import { motion } from "motion/react";

type AlertComponentProps = AlertProps & {
  onClose: () => void;
  onMouseLeave: () => void;
  onMouseEnter: () => void;
};

export const Alert = ({
  text,
  type,
  onClose,
  position,
  onMouseEnter,
  onMouseLeave,
}: AlertComponentProps): JSX.Element => (
  <motion.div
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ duration: 1.3, ease: "easeInOut" }}
    className={`fixed left-1/2 transform -translate-x-1/2 p-4 z-50 text-white flex flex-row items-center justify-center text-center rounded-lg w-auto min-w-[230px] max-w-[90vw] h-[65px] shadow-lg ${
      position === "top" ? "top-6" : "bottom-6"
    } ${type === "success" ? "bg-green-500" : "bg-red-500"}`}
    onMouseLeave={onMouseLeave}
    onMouseEnter={onMouseEnter}
  >
    <div className="flex items-center justify-center w-12 h-12 mr-3">
      {type === "success" ? (
        <CheckCircle className="w-9 h-9 text-white" />
      ) : (
        <XCircle className="w-9 h-9 text-white" />
      )}
    </div>
    <p className="flex-1 text-white text-lg font-medium">{text}</p>
    <button
      className="flex items-center justify-center w-6 h-6 ml-3 text-white cursor-pointer transition-transform duration-200 hover:scale-110"
      onClick={onClose}
    >
      <X className="w-6 h-6" />
    </button>
  </motion.div>
);
