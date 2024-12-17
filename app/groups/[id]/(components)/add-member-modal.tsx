"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const memberSchema = z.object({
  walletAddress: z.string().min(32, {
    message: "Please enter a valid Solana wallet address",
  }),
  twitterName: z
    .string()
    .min(1, {
      message: "Twitter username is required",
    })
    .regex(/^[A-Za-z0-9_]{1,15}$/, {
      message: "Please enter a valid Twitter username",
    }),
});

const formSchema = z.object({
  members: z.array(memberSchema).min(1),
});

type FormData = z.infer<typeof formSchema>;

interface AddMemberModalProps {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddMemberModal({
  groupId,
  isOpen,
  onClose,
  onSuccess,
}: AddMemberModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      members: [{ walletAddress: "", twitterName: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);

    try {
      const promises = values.members.map((member) =>
        fetch(`/api/groups/${groupId}/members`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress: member.walletAddress,
            twitterName: member.twitterName,
          }),
        }).then(res => {
          if (!res.ok) throw new Error('Failed to add member');
          return res.json();
        })
      );

      const results = await Promise.allSettled(promises);
      
      const successes = results.filter((r) => r.status === "fulfilled").length;
      const failures = results.filter((r) => r.status === "rejected").length;

      if (successes > 0) {
        toast({
          title: "Success",
          description: `Successfully added ${successes} member${
            successes > 1 ? "s" : ""
          }${failures > 0 ? ` (${failures} failed)` : ""}`,
        });
        form.reset();
        onSuccess();
        onClose();
      } else {
        throw new Error("Failed to add any members");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
          <DialogDescription>
            Add members to the group with their wallet addresses and Twitter
            usernames.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 overflow-y-auto pr-6 -mr-6">
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div 
                  key={field.id} 
                  className={cn(
                    "flex gap-4 items-start p-4 rounded-lg border",
                    index % 2 === 0 ? "bg-muted/50" : "bg-background"
                  )}
                >
                  <div className="flex-1 space-y-4">
                    <FormField
                      control={form.control}
                      name={`members.${index}.walletAddress`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            Wallet Address {index + 1}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Solana wallet address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`members.${index}.twitterName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            Twitter Username {index + 1}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Twitter username (without @)"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/^@/, "");
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-8"
                      onClick={() => remove(index)}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ walletAddress: "", twitterName: "" })}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Another Member
            </Button>
          </form>
        </Form>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onClose();
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading} 
            onClick={form.handleSubmit(onSubmit)}
          >
            Add Members
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
