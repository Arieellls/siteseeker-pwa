import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SettingsIcon from "@mui/icons-material/Settings";

import HomePage from "@/app/components/tabs/home/Home";

export default function NavigationsTab({ classname }: { classname: string }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const renderContent = () => {
    switch (value) {
      case 0:
        return <HomePage />;
      case 1:
        return (
          <div>
            Maps Page Content
            <h1>alksdashdhasdh</h1>
          </div>
        );
      case 2:
        return <div>Camera Page Content</div>;
      case 3:
        return <div>Settings Page Content</div>;
      default:
        return <div>Home Page Content</div>;
    }
  };

  return (
    <div className={`w-full ${classname}`}>
      <div
        className=" h-screen flex justify-center items-start w-full"
        style={{ marginTop: "20px" }}
      >
        {renderContent()}
      </div>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="navigation tabs"
        centered
      >
        <Tab icon={<HomeIcon />} aria-label="home" />
        <Tab icon={<MapIcon />} aria-label="maps" />
        <Tab icon={<CameraAltIcon />} aria-label="camera" />
        <Tab icon={<SettingsIcon />} aria-label="settings" />
      </Tabs>
    </div>
  );
}
