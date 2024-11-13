import { suggestedChatData } from "@/constants/constants";
import { CirclePlus } from "lucide-react";
import React from "react";

const SuggestedText = ({
  handleSuggestedText,
}: {
  handleSuggestedText: (val: string) => void;
}) => {
  return (
    <section className="absolute bottom-0 flex overflow-x-auto whitespace-nowrap max-w-full">
      {suggestedChatData.map((chat) => (
        <div
          onClick={() => handleSuggestedText(chat)}
          key={chat}
          className="cursor-pointer m-4 p-4 bg-slate-200 rounded-lg break-words flex items-center"
        >
          <div>
            <p className="w-[180px] text-sm text-gray-500 text-wrap font-medium pr-2 ">
              {chat}
            </p>
          </div>
          <div>
            <CirclePlus />
          </div>
        </div>
      ))}
    </section>
  );
};

export default SuggestedText;
