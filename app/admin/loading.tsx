import { Loader2 } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Loader2 className="animate-spin" size={24} />
    </div>
  );
};

export default loading;
