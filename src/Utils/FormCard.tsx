"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

const FormCard = ({ children, title, className = "" }: FormCardProps) => {
  return (
    <Card className={`bg-card border-border shadow-sm ${className}`}>
      {title && (
        <CardHeader className="border-b border-border/50 pb-4 mb-4">
          <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="px-4 pb-4 sm:px-6">{children}</CardContent>
    </Card>
  );
};

export default FormCard;
