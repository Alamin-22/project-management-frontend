/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Control, FieldValues, Path } from "react-hook-form";
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

type FieldType =
  | "text"
  | "number"
  | "password"
  | "textarea"
  | "select"
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
  onValueChange?: (val: string) => void;
}

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
