"use client";

import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { FormInput } from "@/schemas";
import { Input } from "./ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";

interface QuizSourceSelectorProps {
  form: ReturnType<typeof useForm<FormInput>>;
  className?: string;
  defaultTab?: "topic" | "content";
}

export function QuizSourceSelector({
  form,
  className,
  defaultTab = "topic",
}: QuizSourceSelectorProps) {
  return (
    <Tabs.Root
      defaultValue={defaultTab}
      className={cn("w-full", className)}
      onValueChange={(value) => {
        if (value === "topic") {
          form.setValue("content", undefined);
          form.clearErrors("content");
        } else if (value === "content") {
          form.setValue("topic", undefined);
          form.clearErrors("topic");
        }
      }}
    >
      <Tabs.List className="flex w-full rounded-lg bg-muted p-1 text-muted-foreground">
        <Tabs.Trigger
          value="topic"
          className="w-full data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md px-3 py-1.5 text-sm font-medium transition-all"
        >
          Topic
        </Tabs.Trigger>
        <Tabs.Trigger
          value="content"
          className="w-full data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md px-3 py-1.5 text-sm font-medium transition-all"
        >
          Paste Content
        </Tabs.Trigger>
      </Tabs.List>

      <div className="mt-4">
        <Tabs.Content value="topic">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a topic" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>
                  Please provide any topic you would like to be quizzed on here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Tabs.Content>

        <Tabs.Content value="content">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Paste your content here..."
                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Paste the content you would like to be quizzed on here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
}
