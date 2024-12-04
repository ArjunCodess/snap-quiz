"use client";

import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Control } from "react-hook-form";

interface ContentInputProps {
  form: {
    control: Control<{
      content: string;
      source: string;
    }>;
    setValue: (name: string, value: string) => void;
  };
}

export function ContentInput({ form }: ContentInputProps) {
  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Content</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Paste your content here..."
              className="min-h-[200px] resize-y"
              {...field}
              onChange={(e) => {
                field.onChange(e);
                form.setValue("source", "content");
              }}
            />
          </FormControl>
          <FormDescription>
            Paste any text content you would like to generate quiz questions from.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
