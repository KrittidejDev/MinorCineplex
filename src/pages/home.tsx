import Icon from "@/components/Icons/Icon";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/userServices";
import React from "react";

const Home = () => {
  return (
    <div>
      <Button className="btn-signin">Login</Button>
      <Icon width="30" color="#ff0000" />
    </div>
  );
};

export default Home;
