"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import { Pencil } from "lucide-react";
import { X } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const StyleContent = () => {
  const { mapLayers, selectedPopupLayer, setSelectedPopupLayer } =
    useMapViewStore();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [lineColor, setLineColor] = useState("#fff");
  const [opacity, setOpacity] = useState(0);

  // POINT AND POLYGON STATES
  const [fillColor, setFillColor] = useState("#fff");

  // LINE AND POLYGON STATES
  const [lineWidth, setLineWidth] = useState(0);

  // POINT STYLES STATES
  const [symbolSize, setSymbolSize] = useState(0);
  const [outlineColor, setOutlineColor] = useState("#fff");

  //

  useEffect(() => {
    if (!selectedPopupLayer) {
      setSelectedPopupLayer(mapLayers[0]);
    }
  }, [mapLayers, selectedPopupLayer, setSelectedPopupLayer]);

  const handleLineColorChange = (value) => {
    setLineColor(value);
  };

  const handleOpacitySliderChange = (value) => {
    setOpacity(value);
  };

  // POINT AND POLYGON METHODS
  const handleFillColorChange = (value) => {
    setFillColor(value);
  };

  // LINE AND POLYGON METHODS
  const handleLineWidthChange = (value) => {
    setLineWidth(value);
  };

  // POINT STYLES METHODS
  const handleSymbolSizeChange = (value) => {
    setSymbolSize(value);
  };

  if (!selectedPopupLayer) {
    return null;
  }

  console.log("SELECTED POPUP LAYER: ", selectedPopupLayer.layerType);

  return (
    <div className="flex flex-col w-full h-full gap-4 p-2">
      <DropdownMenu
        className="h-10"
        open={openDropdown}
        onOpenChange={setOpenDropdown}
      >
        <DropdownMenuTrigger asChild className="w-full">
          <button className="flex items-center gap-2 px-3 py-2 text-white rounded-md bg-nileBlue-900">
            <p className="w-full truncate">{selectedPopupLayer.layerTitle}</p>
            <ChevronDownIcon
              className={cn("w-5 h-5 transition-all", {
                "-rotate-180": openDropdown,
              })}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0 text-white w-[224px] bg-nileBlue-900 pr-2">
          <DropdownMenuRadioGroup
            value={selectedPopupLayer}
            onValueChange={setSelectedPopupLayer}
          >
            {mapLayers.map((layer) => {
              return (
                <DropdownMenuRadioItem
                  value={layer}
                  key={`${layer.layerUid}`}
                  className="w-full"
                  dotClassName="!fill-rose-800	"
                >
                  {layer.layerTitle}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {selectedPopupLayer.layerType === "Point" && (
        <>
          <p className="font-bold">Size</p>
          <SliderComponent
            sliderValue={symbolSize}
            setSliderValue={handleSymbolSizeChange}
            sliderUnit={"%"}
          />
        </>
      )}
      {(selectedPopupLayer.layerType === "Point" ||
        selectedPopupLayer.layerType === "Polygon") && (
        <>
          <p className="font-bold">Fill Color</p>
          <ColorComponent
            color={fillColor}
            setColorChange={handleFillColorChange}
          />
        </>
      )}

      <p className="font-bold">Line Color</p>
      <ColorComponent
        color={lineColor}
        setColorChange={handleLineColorChange}
      />

      <p className="font-bold">Line Width</p>
      <SliderComponent
        sliderValue={lineWidth}
        setSliderValue={handleLineWidthChange}
        sliderUnit={"px"}
      />

      <p className="font-bold">Transparency</p>
      <SliderComponent
        sliderValue={opacity}
        setSliderValue={handleOpacitySliderChange}
        sliderUnit={"%"}
      />
    </div>
  );
};

export default StyleContent;

const ColorComponent = (props) => {
  const { color, setColorChange } = props;
  // const [color, setColor] = useState("#fff");
  const [showPopup, setShowPopup] = useState(false);

  const handleChangeComplete = (color) => {
    setColorChange(color.hex);
  };

  const handlePickerClick = (event) => {
    event.stopPropagation(); // Stops the click from closing the picker
  };

  const togglePopup = () => {
    setShowPopup((show) => !show);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="z-20 flex flex-col items-center w-full gap-4">
      <button
        className="flex w-full gap-2 p-2 mb-4 text-base rounded-md shadow-md cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          togglePopup();
        }}
      >
        <div
          style={{ backgroundColor: color }}
          className="w-full h-5 rounded-md"
        />
        <Pencil className="w-5 h-5" />
      </button>
      {showPopup && (
        <div
          className="absolute left-0 right-0 flex flex-col items-center gap-2 p-2 bg-white rounded-md"
          onClick={handlePickerClick}
        >
          <div className="flex items-center justify-between w-full gap-2 p-2">
            <span className="font-bold">Select color</span>
            <X onClick={handleClose} className="w-5 h-5 cursor-pointer" />
          </div>
          <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
          <Button onClick={handleClose}>Done</Button>
        </div>
      )}
    </div>
  );
};

const SliderComponent = (props) => {
  const { sliderValue, setSliderValue, sliderUnit } = props;
  return (
    <div className="flex items-center w-full gap-3 p-2 mb-4 text-base rounded-md shadow-md cursor-pointer">
      <Slider
        value={[sliderValue]}
        onValueChange={setSliderValue}
        max={100}
        step={1}
      />
      <div className="flex items-center gap-2 px-2 rounded-md shadow-md">
        <p className="w-4">{sliderValue}</p>
        <div className="flex flex-col">
          <ChevronUp
            className="w-4 h-4 cursor-pointer p-0.5"
            onClick={() => {
              if (parseInt(sliderValue) < 100 && parseInt(sliderValue) >= 0) {
                setSliderValue(parseInt(sliderValue) + 1);
              }
            }}
          />
          <ChevronDown
            className="w-4 h-4 cursor-pointer p-0.5"
            onClick={() => {
              if (parseInt(sliderValue) <= 100 && parseInt(sliderValue) > 0) {
                setSliderValue(parseInt(sliderValue) - 1);
              }
            }}
          />
        </div>
      </div>
      <p>{sliderUnit}</p>
    </div>
  );
};
