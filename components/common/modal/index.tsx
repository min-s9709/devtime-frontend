"use client";

import { useModalStore } from "@/store/use-modal-store";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  className?: string;
  children?: ReactNode;
}

const subscribe = () => () => {};

export default function Modal({ className, children }: ModalProps) {
  const { isOpen, close } = useModalStore();

  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dim-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className={cn(
              "bg-white rounded-md w-full max-w-115 px-2 py-4",
              className,
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
