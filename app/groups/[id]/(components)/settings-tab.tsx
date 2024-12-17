import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilIcon } from "@heroicons/react/24/outline";
import { formatNumber } from "@/lib/utils";
import { GroupDetails } from "@/types/group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGroup } from "@/hooks/group/useGroup";
import { useToken } from "@/hooks/token/useToken";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Group name must be at least 2 characters.",
  }),
  tokenCA: z.string().min(32, {
    message: "Please enter a valid token address.",
  }),
  threshold: z.string().min(1, {
    message: "Please enter a token threshold.",
  }),
});

interface SettingsTabProps {
  group: GroupDetails;
  onUpdate: () => void;
}

export function SettingsTab({ group, onUpdate }: SettingsTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateGroup } = useGroup();
  const { getToken } = useToken();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: group.name,
      tokenCA: group.tokenCA,
      threshold: group.threshold.toString(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      if (values.tokenCA !== group.tokenCA) {
        const token = await getToken(values.tokenCA);
        if (!token || !token.ca || !token.name) {
          form.setError("tokenCA", {
            message:
              "Invalid token address. Please enter a valid SPL token address.",
          });
          setIsSubmitting(false);
          return;
        }

        const updated = await updateGroup(group.id, {
          name: values.name,
          tokenCA: values.tokenCA,
          tokenName: token?.name,
          threshold: parseInt(values.threshold),
        });

        if (updated) {
          setIsEditing(false);
          onUpdate();
        }
      } else {
        const updated = await updateGroup(group.id, {
          name: values.name,
          threshold: parseInt(values.threshold),
        });

        if (updated) {
          setIsEditing(false);
          onUpdate();
        }
      }
    } catch (error) {
      console.error("Failed to update group:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Group Settings</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          disabled={isSubmitting}
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tokenCA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token Contract Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                      <Input 
                        type="number" 
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <>
            <div>
              <h3 className="font-medium mb-2">Token Requirements</h3>
              <p className="text-sm text-muted-foreground">
                Members must hold at least {formatNumber(group.threshold)} tokens of{" "}
                {group.tokenName || group.tokenCA} to join this group.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Visibility</h3>
              <p className="text-sm text-muted-foreground">
                This group is {group.visibility.toLowerCase()}.
                {group.visibility === "PUBLIC"
                  ? " Anyone can find and request to join this group."
                  : " Only invited members can join this group."}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 