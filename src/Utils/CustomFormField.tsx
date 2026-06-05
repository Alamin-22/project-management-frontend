/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Check, ChevronsUpDown, X } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type FieldType =
  | "text"
  | "number"
  | "password"
  | "textarea"
  | "select"
  | "multi-select"
  | "date"
  | "email"
  | "datetime-local"
  | "switch";

interface CustomFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: FieldType;
  description?: string;
  options?: { label: string; value: string }[];
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  onValueChange?: (val: string | string[]) => void;
}

// --- Sub-Component: Custom Multi-Select UI ---
const MultiSelectDropdown = ({
  field,
  options,
  placeholder,
  disabled,
  onValueChange,
}: {
  field: any;
  options: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  onValueChange?: (val: string[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedValues: string[] = Array.isArray(field.value)
    ? field.value
    : [];

  const toggleOption = (value: string) => {
    let newValues;
    if (selectedValues.includes(value)) {
      newValues = selectedValues.filter((v) => v !== value);
    } else {
      newValues = [...selectedValues, value];
    }
    field.onChange(newValues);
    onValueChange?.(newValues);
  };

  const removeOption = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== value);
    field.onChange(newValues);
    onValueChange?.(newValues);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:bg-accent/10"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedValues.length === 0 ? (
          <span className="text-muted-foreground">
            {placeholder || "Select options..."}
          </span>
        ) : (
          selectedValues.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <Badge
                key={val}
                variant="secondary"
                className="flex items-center gap-1 pr-1 font-normal"
              >
                {opt?.label || val}
                <div
                  role="button"
                  tabIndex={0}
                  className="rounded-full bg-transparent p-0.5 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={(e) => removeOption(e, val)}
                >
                  <X className="h-3 w-3" />
                </div>
              </Badge>
            );
          })
        )}
        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 custom-scrollbar">
          {options.length === 0 ? (
            <div className="p-3 text-center text-sm text-muted-foreground">
              No options found.
            </div>
          ) : (
            <div className="p-1">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <div
                    key={option.value}
                    className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-3 pr-9 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${
                      isSelected ? "bg-accent/50 font-medium" : ""
                    }`}
                    onClick={() => toggleOption(option.value)}
                  >
                    {option.label}
                    {isSelected && (
                      <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
const CustomFormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  description,
  options = [],
  disabled = false,
  onValueChange,
}: CustomFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {label && (
            <FormLabel className="text-foreground font-medium">
              {label}
            </FormLabel>
          )}

          <FormControl>
            {type === "textarea" ? (
              <Textarea
                placeholder={placeholder}
                className="resize-none min-h-25 bg-background"
                disabled={disabled}
                {...field}
                value={(field.value as any) ?? ""}
              />
            ) : type === "multi-select" ? (
              <MultiSelectDropdown
                field={field}
                options={options}
                placeholder={placeholder}
                disabled={disabled}
                onValueChange={onValueChange as any}
              />
            ) : type === "select" ? (
              <Select
                value={(field.value as any) ?? ""}
                disabled={disabled}
                onValueChange={(val) => {
                  field.onChange(val);
                  onValueChange?.(val);
                }}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : type === "switch" ? (
              <div className="flex items-center space-x-2">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
              </div>
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                value={(field.value as any) ?? ""}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                className="bg-background"
                onChange={(e) => {
                  if (type === "number") {
                    const raw = e.target.value;
                    const value = raw === "" ? "" : Number(raw);
                    field.onChange(value);
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
              />
            )}
          </FormControl>

          {description && (
            <p className="text-[10px] text-muted-foreground mt-1.5">
              {description}
            </p>
          )}

          <FormMessage className="text-[10px] text-destructive font-medium" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
