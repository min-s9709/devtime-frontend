"use client";

import ChevronDown from "@/assets/icons/chevron-down.svg";
import ChevronUp from "@/assets/icons/chevron-up.svg";
import { cn } from "@/utils/cn";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ---- Context ---- */

interface SelectDropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedValue?: string;
  placeholder: string;
  onSelect: (value: string) => void;
}

const SelectDropdownContext = createContext<SelectDropdownContextType | null>(
  null,
);

const useSelectDropdown = () => {
  const context = useContext(SelectDropdownContext);
  if (!context) {
    throw new Error(
      "SelectDropdown 하위 컴포넌트는 SelectDropdown.Root 안에서 사용해야 합니다.",
    );
  }
  return context;
};

/* ---- Root ---- */

interface RootProps {
  placeholder: string;
  selectedValue?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface SelectDropdownProps extends Omit<RootProps, "children"> {
  options: string[];
  label?: string;
  // 라벨 옆에 필수 표시(*)를 노출한다.
  required?: boolean;
}

function Root({
  placeholder,
  selectedValue,
  onChange,
  children,
  className,
}: RootProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSelect = (value: string) => {
    onChange?.(value);
    setIsOpen(false);
  };

  return (
    <SelectDropdownContext.Provider
      value={{ isOpen, setIsOpen, selectedValue, placeholder, onSelect }}
    >
      <div
        className={cn("relative flex flex-col gap-2", className)}
        ref={dropdownRef}
      >
        {children}
      </div>
    </SelectDropdownContext.Provider>
  );
}

/* ---- Trigger ---- */

function Trigger() {
  const { isOpen, setIsOpen, selectedValue, placeholder } = useSelectDropdown();

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className="bg-gray-50 flex justify-between items-center rounded-[5px] px-3 py-3 w-full h-11 text-sm"
    >
      <span className={cn("text-gray-300", selectedValue && "text-gray-600")}>
        {selectedValue || placeholder}
      </span>
      {isOpen ? (
        <ChevronUp className="w-6 h-6 text-primary-gradient-end" />
      ) : (
        <ChevronDown className="w-6 h-6 text-primary-gradient-end" />
      )}
    </button>
  );
}

/* ---- Content ---- */

function Content({ children }: { children: ReactNode }) {
  const { isOpen } = useSelectDropdown();

  if (!isOpen) return null;

  return (
    <ul className="absolute top-full mt-2 left-0 w-full z-10 border border-gray-300 bg-white rounded-[5px] overflow-auto max-h-85">
      {children}
    </ul>
  );
}

/* ---- Item ---- */

function Item({ value }: { value: string }) {
  const { selectedValue, onSelect } = useSelectDropdown();

  return (
    <li
      onClick={() => onSelect(value)}
      className={cn(
        "px-3 py-4 border-b border-b-gray-300 text-body text-gray-600 cursor-pointer hover:bg-gray-100 last:border-0 hover:rounded-[5px]",
        selectedValue === value && "text-primary-gradient-end font-bold",
      )}
    >
      {value}
    </li>
  );
}

export default function SelectDropdown({
  label,
  options,
  required,
  ...props
}: SelectDropdownProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-body-sm font-medium text-gray-600">
          {label}
          {required && <span className="text-negative"> *</span>}
        </label>
      )}
      <Root {...props}>
        <Trigger />
        <Content>
          {options.map((option: string) => (
            <Item key={option} value={option} />
          ))}
        </Content>
      </Root>
    </div>
  );
}
