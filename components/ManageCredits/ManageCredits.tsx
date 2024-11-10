import { getMessagesCount } from "@/lib/userData";
import React from "react";
import Plans from "../Plans/Plans";

const ManageCredits = async ({
  email,
}: {
  email: string | undefined | null;
}) => {
  const count = await getMessagesCount(email);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[80vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <div className="flex flex-col gap-4 p-4">
          <h1 className="text-3xl text-center font-bold m-4">Manage Credits</h1>
          <p className="text-center text-gray-600 m-4">
            Current Credits: <span className="font-bold">{count}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto p-4 sm:p-6">
            <Plans />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCredits;
