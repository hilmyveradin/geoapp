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
import LayersContent from "./map-sidebar/layers-content";
import { ButtonSidebar } from "@/components/ui/button-sidebar";

const MapSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showButtonSidebar, setShowButtonSidebar] = useState(true);
  const [selectedButton, setSelectedButton] = useState(null);
  const [showSidebarRight, setShowSidebarRight] = useState(true);

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
  const SaveContent = () => <div>Save content goes here</div>;
  const ShareContent = () => <div>Share content goes here</div>;
  const PrintContent = () => <div>Print content goes here</div>;
  const CollapseContent = () => <div>Collapse content goes here</div>;

  // Define content for each button
  const buttonContent = {
    add: <AddContent />,
    layers: <LayersContent />,
    basemap: <BasemapContent />,
    save: <SaveContent />,
    share: <ShareContent />,
    print: <PrintContent />,
    collapse: <CollapseContent />,
  };

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName === selectedButton ? null : buttonName);
    setShowButtonSidebar((prev) => !prev)
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
  console.log(showButtonSidebar)
  return (
    <div className="flex flex-row">
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
              "left-12 w-60": showSidebar,
              "left-40 w-60": !showSidebar,
            }
          )}
        >
          {buttonContent[selectedButton]}
        </div>
      )}
      <div
        className = {cn(
          "fixed bottom-6 z-10 bg-black top-[65vh] h-[calc(100vh-65vh-24px)]",
          {
            "left-[292px] w-[calc(100vw-292px-52px)]": !showButtonSidebar && showSidebar,
            "left-[164px] w-[calc(100vw-164px-52px)]": showButtonSidebar && !showSidebar,
            "left-[404px] w-[calc(100vw-404px-52px)]": !showButtonSidebar && !showSidebar,
            "left-[52px] w-[calc(100vw-52px-52px)]": showButtonSidebar && showSidebar && showSidebarRight,
            "left-[52px] w-[calc(100vw-52px-184px)]": showButtonSidebar && showSidebar && !showSidebarRight,
          }
        )}>

      </div>
      <div
        className={cn(
          "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] right-0 bottom-10 z-10 bg-white w-[48px]",
          {
            "w-[180px]": !showSidebarRight,
          },
        )}
      >
        <ButtonSidebar variant="ghost">
          <img
            className={cn("w-4 h-4")}
            src="/app/style-icon.svg"
            alt="style icon"
          />
          {!showSidebarRight && <span className="ml-2 inline-block">Style</span>}
        </ButtonSidebar>
        <ButtonSidebar variant="ghost" onClick={() => setShowSidebarRight((prev) => !prev)}>
          <ChevronRight
            className={cn("w-4 h-4", {
              "-rotate-180": showSidebarRight,
            })}
          />
          {!showSidebarRight && <span className="ml-2 inline-block">Collapse</span>}
        </ButtonSidebar>
      </div>
    </div>
  );
};

export default MapSidebar;
