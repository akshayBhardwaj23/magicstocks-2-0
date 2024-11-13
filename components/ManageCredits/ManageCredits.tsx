import { getMessagesCount } from "@/lib/userData";
import React from "react";
import Plans from "../Plans/Plans";
import { FiStar } from "react-icons/fi"; // Using an icon for aesthetic appeal

const ManageCredits = async ({
  email,
}: {
  email: string | undefined | null;
}) => {
  const count = await getMessagesCount(email);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[80vh] flex-1 rounded-xl bg-muted/50 md:min-h-min shadow-lg">
        <div className="flex flex-col items-center gap-6 p-6">
          <h1 className="text-4xl text-center font-bold">Manage Credits</h1>
          <div className="flex items-center gap-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg px-6 py-3 shadow-md">
            <FiStar size={28} />
            <div>
              <p className="text-lg">
                Current Credits: <span className="font-bold">{count}</span>
              </p>
              <p>[1 credit = 1 message]</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl w-full p-4 sm:p-6 mt-6">
            <Plans />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCredits;
