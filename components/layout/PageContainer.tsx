"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageContainer({ 
  children, 
  className, 
  title, 
  description, 
  action 
}: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("p-6 lg:p-10 space-y-8", className)}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {action && (
          <div className="flex items-center gap-3">
            {action}
          </div>
        )}
      </div>
      
      <div className="w-full">
        {children}
      </div>
    </motion.div>
  );
}
