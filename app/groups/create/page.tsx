"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useWalletCustomHook } from "@/hooks/wallet/useWallet";
import { useGroup } from "@/hooks/group/useGroup";
import { useToken } from "@/hooks/token/useToken";
import { useState } from "react";
import { formatNumber } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Group name must be at least 2 characters.",
  }),
  tokenAddress: z.string().min(32, {
    message: "Please enter a valid SPL token address.",
  }),
  threshold: z.string().min(1, {
    message: "Please enter a token threshold.",
  }),
});

export default function CreateGroupPage() {
  const router = useRouter();
  const { wallet, isConnected } = useWalletCustomHook();
  const { getToken } = useToken();
  const { createGroup } = useGroup();
  const [displayThreshold, setDisplayThreshold] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      tokenAddress: "",
      threshold: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const token = await getToken(values.tokenAddress);

      if (!token || !token.ca || !token.name) {
        form.setError("tokenAddress", {
          message:
            "Invalid token address. Please enter a valid SPL token address.",
        });
        return;
      }

      const groupData = {
        name: values.name || "",
        tokenName: token.name || "",
        tokenCA: values.tokenAddress || "",
        threshold: parseInt(values.threshold) || 0,
        moderatorId: wallet?.id || "",
      };

      const group = await createGroup(groupData);
      if (group) {
        router.push(`/groups/${group.id}`);
      } else {
        console.error("Failed to create group");
      }
    } catch (error) {
      form.setError("tokenAddress", {
        message: "Failed to verify token. Please try again.",
      });
    }
  }

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    
    form.setValue('threshold', rawValue);
    
    if (rawValue) {
      setDisplayThreshold(formatNumber(parseInt(rawValue)));
    } else {
      setDisplayThreshold("");
    }
  };

  if (!isConnected) {
    return <div>Please connect your wallet to create a group.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Create New Group
      </h1>

      <Card className="max-w-2xl mx-auto p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the display name for your group.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tokenAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Address </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter SPL token address" {...field} />
                  </FormControl>
                  <FormDescription>
                    The SPL token address used for gatekeeping.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Threshold</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter minimum token amount"
                        value={displayThreshold}
                        onChange={handleThresholdChange}
                        className="pr-16"
                      />
                      {displayThreshold && (
                        <div className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                          tokens
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Minimum token amount required for membership.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/groups")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Group</Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
