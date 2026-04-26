"use client";
import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserData, updateUserProfileData } from "@/lib/userData";
import { useSession } from "next-auth/react";
import { Sparkles, UserRound, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name should be at least 2 characters" })
    .max(100, { message: "First name should be at most 100 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name should be at least 2 characters" })
    .max(100, { message: "Last name should be at most 100 characters" }),
  phone: z
    .string()
    .min(9, { message: "Enter a valid phone number" })
    .max(14, { message: "Enter a valid phone number" }),
});

const Profile = () => {
  const { data: session } = useSession();
  const [updateMessage, setUpdateMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const fetchUserData = useCallback(async () => {
    if (session?.user) {
      try {
        const { firstName, lastName, phone } = await getUserData(
          session.user.email
        );
        form.reset({
          firstName: firstName || "",
          lastName: lastName || "",
          phone: phone || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
  }, [session?.user, form]);

  useEffect(() => {
    fetchUserData();
  }, [session, fetchUserData]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateUserProfileData(
      session?.user?.email,
      values.firstName,
      values.lastName,
      values.phone
    );
    setUpdateMessage("Details updated");
    setTimeout(() => setUpdateMessage(""), 4000);
  }

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 hero-spotlight" />

      <div className="container mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <div className="text-center">
          <Badge
            variant="secondary"
            className="border-primary/20 bg-primary/10 text-primary"
          >
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            Account
          </Badge>
          <h1 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Your profile
          </h1>
          <p className="mt-3 text-muted-foreground">
            Manage how we contact you. We never share your details.
          </p>
        </div>

        <Card className="mt-8">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <div className="h-10 w-10 rounded-full bg-brand-gradient grid place-items-center">
              <UserRound className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">
                {session?.user?.name || "Signed-in user"}
              </CardTitle>
              <CardDescription>
                {session?.user?.email || ""}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 1234567890" {...field} />
                      </FormControl>
                      <FormDescription>
                        Include the country code.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    className="bg-brand-gradient hover:opacity-90"
                  >
                    Save changes
                  </Button>
                  {updateMessage && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      {updateMessage}
                    </span>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Profile;
