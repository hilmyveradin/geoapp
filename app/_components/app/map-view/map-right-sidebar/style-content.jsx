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
import { Square } from "lucide-react";
import { Circle } from "lucide-react";
import { Triangle } from "lucide-react";
import { Star } from "lucide-react";
import { Cross } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useInsertionEffect } from "react";

const StyleContent = () => {
  const { mapLayers, selectedPopupLayer, setSelectedPopupLayer } =
    useMapViewStore();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [lineColor, setLineColor] = useState("#fff");
  const [opacity, setOpacity] = useState(0);
  const [initialStyle, setInitialStyle] = useState();
  const [isFetching, setIsFetching] = useState(false);

  // POINT AND POLYGON STATES
  const [fillColor, setFillColor] = useState("#fff");

  // LINE AND POLYGON STATES
  const [lineWidth, setLineWidth] = useState(0);

  // POINT STYLES STATES
  const [pointStyle, setPointStyle] = useState(); // this responsible for conditional rendering for marker and image
  const [symbolSize, setSymbolSize] = useState(0);

  useEffect(() => {
    if (!selectedPopupLayer) {
      setSelectedPopupLayer(mapLayers[0]);
    }
  }, [mapLayers, selectedPopupLayer, setSelectedPopupLayer]);

  useEffect(() => {
    if (selectedPopupLayer) {
      async function fetchInitialStyle() {
        setIsFetching(true);

        try {
          const response = await fetch(
            `/api/layers/get-style?layerUid=${selectedPopupLayer.layerUid}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const responseData = await response.json();

          setInitialStyle(responseData.data);

          if (responseData.data.layerType == "Point") {
            if (responseData.data.properties.marker) {
              setPointStyle("marker");
            } else if (responseData.data.properties.imageUrl) {
              setPointStyle("image");
            }
          } else {
            setPointStyle();
          }
        } catch (error) {
          console.error("Failed to fetch layer data:", error);
          // Optionally handle error state
        } finally {
          setIsFetching(false);
        }
      }
      fetchInitialStyle();
    }
  }, [selectedPopupLayer]);

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

  const handlePointStyleChange = (value) => {
    setPointStyle(value);
  };

  if (!selectedPopupLayer) {
    return null;
  }

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
          <p className="font-bold">Current Symbol</p>
          <SymbolComponent
            initialStyle={initialStyle}
            initialPointStyle={pointStyle}
            handlePointStyleChange={handlePointStyleChange}
          />
          <p className="font-bold">Size</p>
          <SliderComponent
            initialSliderValue={parseInt(initialStyle.properties.size)}
            setParentSliderValue={handleSymbolSizeChange}
            sliderUnit={"px"}
          />
        </>
      )}
      {((selectedPopupLayer.layerType === "Point" && pointStyle === "marker") ||
        selectedPopupLayer.layerType === "Polygon") && (
        <>
          <p className="font-bold">Fill Color</p>
          <ColorComponent
            color={fillColor}
            setColorChange={handleFillColorChange}
          />
        </>
      )}

      {pointStyle !== "image" && (
        <>
          <p className="font-bold">Line Color</p>
          <ColorComponent
            color={lineColor}
            setColorChange={handleLineColorChange}
          />
        </>
      )}

      {pointStyle !== "image" && (
        <>
          <p className="font-bold">Line Width</p>
          <SliderComponent
            initialSliderValue={parseInt(initialStyle.properties.lineWidth)}
            setParentSliderValue={handleSymbolSizeChange}
            sliderUnit={"px"}
          />
        </>
      )}

      {pointStyle !== "image" && (
        <>
          <p className="font-bold">Transparency</p>
          <SliderComponent
            initialSliderValue={parseInt(initialStyle.properties.lineOpacity)}
            setParentSliderValue={handleOpacitySliderChange}
            sliderUnit={"%"}
          />
        </>
      )}
    </div>
  );
};

export default StyleContent;

const SymbolComponent = (props) => {
  const { initialStyle, initialPointStyle, handlePointStyleChange } = props;
  const [showPopup, setShowPopup] = useState(false);

  const [style, setStyle] = useState(initialPointStyle);
  const [selectedShapeSymbol, setSelectedShapeSymbol] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  // Set Initial Point Style
  useEffect(() => {
    setStyle(initialPointStyle);
  }, [initialPointStyle]);

  const handlePickerClick = (event) => {
    event.stopPropagation(); // Stops the click from closing the picker
  };

  const togglePopup = () => {
    setShowPopup((show) => !show);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleDone = () => {
    handlePointStyleChange(style);
    setShowPopup(false);
  };

  const renderSymbol = () => {
    if (initialStyle.properties.marker) {
      switch (initialStyle.properties.marker) {
        case "square":
          return <Square className="w-5 h-5" />;
        case "circle":
          return <Circle className="w-5 h-5 " />;
        case "triangle":
          return <Triangle className="w-5 h-5 " />;
        case "star":
          return <Star className="w-5 h-5 " />;
        case "cross":
          return <Cross className="w-5 h-5 rotate-45" />;
        case "x":
          return <Cross className="w-5 h-5 " />;
        default:
          return null; // Add a default case to handle other markers
      }
    }
  };

  return (
    <div className="z-30 flex flex-col items-center w-full gap-4">
      <button
        className="flex justify-between w-full gap-2 p-2 mb-4 text-base rounded-md shadow-md cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          togglePopup();
        }}
      >
        {initialPointStyle === "image" && (
          <img
            className="w-5 h-5"
            src={initialStyle.properties.imageUrl}
            alt="marker"
          />
        )}
        {initialPointStyle === "marker" && renderSymbol()}
        <Pencil className="w-5 h-5" />
      </button>
      {showPopup && (
        <div
          className="absolute left-0 right-0 flex flex-col items-center gap-2 p-2 bg-white rounded-md"
          onClick={handlePickerClick}
        >
          <div className="flex items-center justify-between w-full gap-2 p-2">
            <span className="font-bold">Change Symbol</span>
            <X onClick={handleClose} className="w-5 h-5 cursor-pointer" />
          </div>
          <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
            <DropdownMenuTrigger asChild className="w-full">
              <button className="flex items-center gap-2 px-3 py-2 text-white rounded-md bg-nileBlue-900">
                <p className="w-full truncate">{style}</p>
                <ChevronDownIcon
                  className={cn("w-5 h-5 transition-all", {
                    "-rotate-180": openDropdown,
                  })}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => {
                  setStyle("marker");
                }}
              >
                Standard
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setStyle("image");
                  setSelectedShapeSymbol(null);
                }}
              >
                Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="w-full">
            {style === "marker" ? (
              <div className="flex items-center w-full gap-2">
                <Square
                  className={cn("w-5 h-5 cursor-pointer fill-nileBlue-500", {
                    "outline outline-red-200": selectedShapeSymbol === "square",
                  })}
                  onClick={() => setSelectedShapeSymbol("square")}
                />
                <Circle
                  className={cn("w-5 h-5 cursor-pointer fill-nileBlue-500", {
                    "outline outline-red-200": selectedShapeSymbol === "circle",
                  })}
                  onClick={() => setSelectedShapeSymbol("circle")}
                />
                <Triangle
                  className={cn("w-5 h-5 cursor-pointer fill-nileBlue-500", {
                    "outline outline-red-200":
                      selectedShapeSymbol === "triangle",
                  })}
                  onClick={() => setSelectedShapeSymbol("triangle")}
                />
                <Star
                  className={cn("w-5 h-5 cursor-pointer fill-nileBlue-500", {
                    "outline outline-red-200": selectedShapeSymbol === "star",
                  })}
                  onClick={() => setSelectedShapeSymbol("star")}
                />
                <Cross
                  className={cn(
                    "w-5 h-5 cursor-pointer fill-nileBlue-500 rotate-45",
                    {
                      "outline outline-red-200":
                        selectedShapeSymbol === "cross",
                    }
                  )}
                  onClick={() => setSelectedShapeSymbol("cross")}
                />
                <Cross
                  className={cn("w-5 h-5 cursor-pointer fill-nileBlue-500", {
                    "outline outline-red-200": selectedShapeSymbol === "x",
                  })}
                  onClick={() => setSelectedShapeSymbol("x")}
                />
              </div>
            ) : (
              <ImageUpload />
            )}
          </div>
          <Button onClick={handleDone}>Done</Button>
        </div>
      )}
    </div>
  );
};

const ColorComponent = (props) => {
  const { color, setColorChangem, initialStyle } = props;
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
  const { setParentSliderValue, sliderUnit, initialSliderValue } = props;

  const [sliderValue, setSliderValue] = useState(initialSliderValue);

  // Making sure the sliderValue set it's inital to the beginning
  useEffect(() => {
    setSliderValue(initialSliderValue);
  }, [initialSliderValue]);

  return (
    <div className="flex items-center w-full gap-3 p-2 mb-4 text-base rounded-md shadow-md cursor-pointer">
      <Slider
        value={[sliderValue]}
        onValueChange={(e) => {
          setParentSliderValue(e); // This to track the given value from global state
          setSliderValue(e);
        }}
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

const ImageUpload = () => {
  const [imageSrc, setImageSrc] = useState(""); // State for the image source for preview

  useEffect(() => {
    console.log(imageSrc);
  }, [imageSrc]);

  // Handle URL input and fetch image
  const handleImageUrlChange = async (event) => {
    const imageUrl = event.target.value;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);
      setImageSrc(localUrl); // Set image source for preview
    } catch (error) {
      console.error("Error loading image:", error);
    }
  };

  // Handle local file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setImageSrc(localUrl); // Set image source for preview
    }
  };

  // Custom icon click to trigger file input
  const handleIconClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-3">
      <div className="flex items-center justify-center w-full gap-2">
        <Input
          type="text"
          placeholder="Image URL"
          onChange={handleImageUrlChange}
        />
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }} // Hide the default file input
          onChange={handleFileChange}
        />
        <Plus
          className="cursor-pointer stroke-2 w-7 h-7"
          onClick={handleIconClick}
        />
      </div>
      {imageSrc && <img src={imageSrc} alt="Preview" className="w-20 h-20" />}
    </div>
  );
};
