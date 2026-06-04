import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

export interface BreadcrumbPath {
  label: string;
  href?: string;
}

interface Props {
  paths: BreadcrumbPath[];
}

export default function ReusableBreadcrumb({ paths }: Props) {
  return (
    <Breadcrumb className="mb-6 ml-2">
      <BreadcrumbList>
        {/* Home Link */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="flex items-center gap-1">
              <Home className="w-3 h-3" />
              <span>Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {/* Dynamic Paths */}
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;

          return (
            <React.Fragment key={path.label}>
              <BreadcrumbItem>
                {isLast || !path.href ? (
                  <BreadcrumbPage className="font-medium text-gray-900 line-clamp-1 max-w-50 sm:max-w-none">
                    {path.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={path.href} className="capitalize">
                      {path.label.replace(/-/g, " ")}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
