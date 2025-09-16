import { Button } from "@/components/ui/button";
import { SuccessNotification, ErrorNotification } from "@/components/ui/notifications";
import React from "react";

const AllWidget = () => {
  return (
    <div>
      <div>
        <div>button</div>
        <Button className="btn-signin">btn-signin</Button>
      </div>
      <div>notifications</div>
      <SuccessNotification />
      <ErrorNotification />
    </div>
  );
};

export default AllWidget;
