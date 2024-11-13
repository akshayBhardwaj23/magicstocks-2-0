import React from "react";
import { DataTable } from "./DataTable";
import { columns, Payment } from "./columns";
import { getOrderData } from "@/lib/orderData";

const BillingHistory = async ({
  email,
}: {
  email: string | undefined | null;
}) => {
  const data: Payment[] = await getOrderData(email);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[80vh] flex-1 rounded-xl bg-muted/50 md:min-h-min shadow-lg">
        <div className="flex flex-col items-center gap-6 p-6">
          <h1 className="text-4xl text-center font-bold">Billing History</h1>
          <div className="mt-4 w-full">
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingHistory;
