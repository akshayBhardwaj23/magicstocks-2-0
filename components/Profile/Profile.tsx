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
import { getUserData, updateUserProfileData } from "@/lib/userData";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First Name should be minimum 2 characters" })
    .max(100, { message: "First Name should be maximum 100 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last Name should be minimum 2 characters" })
    .max(100, { message: "Last Name should be maximum 100 characters" }),
  phone: z
    .string()
    .min(9, { message: "Enter a valid phone number" })
    .max(14, { message: "Enter a valid phone number" }),
});

const Profile = () => {
  const { data: session } = useSession();
  const [updateMessage, setUpdateMessage] = useState("");

  // 1. Define your form.
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

        // Reset form with fetched values
        form.reset({
          firstName: firstName,
          lastName: lastName,
          phone: phone,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
  }, [session?.user, form]);

  useEffect(() => {
    fetchUserData();
  }, [session, fetchUserData]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateUserProfileData(
      session?.user?.email,
      values.firstName,
      values.lastName,
      values.phone
    );
    setUpdateMessage("Details Updated");
    console.log("detals updated");
    setTimeout(() => {
      setUpdateMessage("");
    }, 4000);
  }

  return (
    <section className="m-4 p-4">
      <h1 className="text-6xl font-bold m-6 text-center">Profile</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter new First Name to update.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter new Last Name to update.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+91 1234567890" {...field} />
                </FormControl>
                <FormDescription>Enter with country code.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update</Button>
          {updateMessage !== "" && <p>{updateMessage}</p>}
        </form>
      </Form>
    </section>
  );
};

export default Profile;
