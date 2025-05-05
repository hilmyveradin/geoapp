"use client";

import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronLeft,
  PlusCircle,
  Layers3,
  Sheet,
  Save,
  Share2,
  Printer,
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LegendContent from "./map-sidebar/legend-content";
import LayersContent from "./map-sidebar/layers-content";
import { ButtonSidebar } from "@/components/ui/button-sidebar";

const MapSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showButtonSidebar, setShowButtonSidebar] = useState(true);
  const [selectedButton, setSelectedButton] = useState(null);

  // Reusable Button component
  const Button = ({ icon, label, onClick }) => (
    <ButtonSidebar variant="ghost" onClick={onClick}>
      {icon}
      {!showSidebar && <span className="inline-block ml-2">{label}</span>}
    </ButtonSidebar>
  );

  // Define content components for each button
  const AddContent = () => <div>Add content goes here</div>;
  // const LayersContent = () => <div>Layers content goes here</div>;
  const BasemapContent = () => <div>Basemap content goes here</div>;
  const TablesContent = () => <div>Tables content goes here</div>;
  const SaveContent = () => <div>Save content goes here</div>;
  const ShareContent = () => <div>Share content goes here</div>;
  const PrintContent = () => <div>Print content goes here</div>;
  const CollapseContent = () => <div>Collapse content goes here</div>;

  // Define content for each button
  const buttonContent = {
    add: <AddContent />,
    layers: <LayersContent />,
    basemap: <BasemapContent />,
    tables: <TablesContent />,
    save: <SaveContent />,
    share: <ShareContent />,
    print: <PrintContent />,
    collapse: <CollapseContent />,
  };

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName === selectedButton ? null : buttonName);
  };

  // Button data
  const buttons = [
    {
      icon: <PlusCircle className={cn("w-4 h-4")} />,
      label: "Add",
      onClick: () => handleButtonClick("add"),
    },
    {
      icon: <Layers3 className={cn("w-4 h-4")} />,
      label: "Layers",
      onClick: () => handleButtonClick("layers"),
    },
    {
      icon: (
        <img
          className={cn("w-4 h-4")}
          src="/app/basemap-svgrepo-com.svg"
          alt="basemap icon"
        />
      ),
      label: "Basemap",
      onClick: () => handleButtonClick("basemap"),
    },
    {
      icon: <Sheet className={cn("w-4 h-4")} />,
      label: "Tables",
      onClick: () => handleButtonClick("tables"),
    },
    {
      icon: <Save className={cn("w-4 h-4")} />,
      label: "Save",
      onClick: () => handleButtonClick("save"),
    },
    {
      icon: <Share2 className={cn("w-4 h-4")} />,
      label: "Share",
      onClick: () => handleButtonClick("share"),
    },
    {
      icon: <Printer className={cn("w-4 h-4")} />,
      label: "Print",
      onClick: () => handleButtonClick("print"),
    },
    {
      icon: (
        <ChevronLeft
          className={cn("w-4 h-4", { "-rotate-180": showSidebar })}
        />
      ),
      label: "Collapse",
      onClick: () => setShowSidebar((prev) => !prev),
    },
  ];

  return (
    <div className="relative">
      <div
        className={cn(
          "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] left-0 bottom-10 z-10 bg-gn-400 w-[48px]",
          {
            "w-[160px]": !showSidebar,
          }
        )}
      >
        {/* Render buttons dynamically */}
        {buttons.map((button, index) => (
          <Button key={index} {...button} />
        ))}
      </div>
      {selectedButton && (
        <div
          className={cn(
            "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] bottom-10 z-10 bg-white",
            {
              "left-12 w-fit": showSidebar,
              "left-40 w-60": !showSidebar,
            }
          )}
        >
          {buttonContent[selectedButton]}
        </div>
      )}
    </div>
  );
};

export default MapSidebar;
