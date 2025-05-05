"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
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
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  capitalizeFirstLetter,
  handleErrorMessage,
} from "@/helpers/string-helpers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "ace-builds";
import AceEditor from "react-ace";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";

const StyleContent = () => {
  const {
    mapLayers,
    selectedLayer,
    setSelectedLayer,
    toggleRefreshLayerOrder,
    setChangedLayerStyleUid,
  } = useMapViewStore();
  const { toast } = useToast();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [initialStyle, setInitialStyle] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [toggleRefetchStyle, setToggleRefetchStyle] = useState(false);

  const [lineColor, setLineColor] = useState("#fff");
  const [lineOpacity, setLineOpacity] = useState(1);
  const [tabValue, setTabValue] = useState("basic");

  // POINT AND POLYGON STATES
  const [fillColor, setFillColor] = useState("#fff");
  const [fillOpacity, setFillOpacity] = useState(1);

  // LINE AND POLYGON STATES
  const [lineWidth, setLineWidth] = useState(1);

  // POINT STYLES STATES
  const [pointStyle, setPointStyle] = useState(); // this responsible for conditional rendering for marker and image
  const [pointSize, setPointSize] = useState(20);
  const [pointRotation, setPointRotation] = useState(0);
  const [pointMarker, setPointMarker] = useState("");
  const [pointImageUrl, setPointImageUrl] = useState("");
  const [pointImageData, setPointImageData] = useState();

  // ADVANCED STYLES
  const [advancedJson, setAdvancedJson] = useState();

  // Refresh advanced JSON if there's change in selectedLayer
  useEffect(() => {
    setAdvancedJson("");
  }, [selectedLayer]);

  // This effect responsible for set the selectedPopuplayer if it's not exists --> might want to refactor later
  // useEffect(() => {
  //   if (!selectedLayer) {
  //     setSelectedLayer(mapLayers[0]);
  //   }
  // }, [mapLayers, selectedLayer, setSelectedLayer]);

  // This effect resonsible for fetching initial styles if selectedLayer exists
  useEffect(() => {
    if (selectedLayer) {
      async function fetchInitialStyle() {
        setIsFetching(true);

        try {
          const response = await fetch(
            `/api/layers/get-style?layerUid=${selectedLayer.layerUid}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const responseData = await response.json();

          const { properties, layerType } = responseData.data;

          // Update states based on fetched data
          setInitialStyle(responseData.data);

          if (layerType === "Point") {
            setLineColor(properties.lineColor || "#000");
            setLineWidth(properties.lineWidth || 1);
            setFillColor(properties.fillColor || "#fff");
            setFillOpacity(properties.fillOpacity || 1);
            setPointSize(properties.size || 20);
            setPointRotation(properties.rotation || 0);

            if (properties.marker) {
              setPointStyle("marker");
              setPointMarker(properties.marker);
            } else if (properties.imageUrl) {
              setPointStyle("image");
              setPointImageUrl(properties.imageUrl);
            }
          } else if (layerType === "Line" || layerType === "Polygon") {
            setLineColor(properties.lineColor || "#000");
            setLineWidth(properties.lineWidth || 1);
            setFillColor(properties.fillColor || "#fff");
            setFillOpacity(properties.fillOpacity || 1);
          }
        } catch (error) {
          console.error("Failed to fetch layer data:", error);
        } finally {
          setIsFetching(false);
        }
      }

      fetchInitialStyle();
    }
  }, [selectedLayer, toggleRefetchStyle]);

  const handleLineColorChange = (value) => {
    setLineColor(value);
  };

  const handleLineOpacitySliderChange = (value) => {
    setLineOpacity(value);
  };

  const handleFillOpacitySliderChange = (value) => {
    setFillOpacity(value);
  };

  // POINT AND POLYGON METHODS
  const handleFillColorChange = (value) => {
    setFillColor(value);
  };

  const handleLineWidthChange = (value) => {
    setLineWidth(value);
  };

  // POINT STYLES METHODS
  const handlePointSizeChange = (value) => {
    setPointSize(value);
  };

  const handlePointStyleChange = (value) => {
    setPointStyle(value);
  };

  const handlePointImageUrlChange = (value) => {
    setPointImageUrl(value);
  };

  const handlePointImageDataChange = (value) => {
    setPointImageData(value);
  };

  const handlePointRotationChange = (value) => {
    setPointRotation(value);
  };

  const handlePointMarkerChange = (value) => {
    setPointMarker(value);
  };

  const saveStyleChanges = () => {
    setIsSavingChanges(true);

    const saveSymbolStyle = async () => {
      if (pointStyle === "marker") {
        const body = {
          marker: pointMarker,
          size: Array.isArray(pointSize) ? pointSize[0] : pointSize,
          fill_color: fillColor,
          fill_opacity: Array.isArray(fillOpacity)
            ? fillOpacity[0]
            : fillOpacity,
          line_color: lineColor,
          line_width: Array.isArray(lineWidth) ? lineWidth[0] : lineWidth,
          line_opacity: Array.isArray(lineOpacity)
            ? lineOpacity[0]
            : lineOpacity,
          rotation: Array.isArray(pointRotation)
            ? pointRotation[0]
            : pointRotation,
        };

        return fetch(
          `/api/layers/save-point-marker?layerUid=${selectedLayer.layerUid}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      } else if (pointStyle === "image") {
        if (pointImageUrl) {
          const body = {
            image_url: pointImageUrl,
            size: pointSize,
            rotation: Array.isArray(pointRotation)
              ? pointRotation[0]
              : pointRotation,
          };

          return fetch(
            `/api/layers/save-point-image-url?layerUid=${selectedLayer.layerUid}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }
          );
        } else if (pointImageData) {
          const formData = new FormData();
          formData.append("size", pointSize);
          formData.append("uploadFile", pointImageData);

          return fetch(
            `/api/layers/save-point-image?layerUid=${selectedLayer.layerUid}`,
            {
              method: "POST",
              headers: { "Content-Type": "multipart/form-data" },
              body: formData,
            }
          );
        }
      }
    };

    const saveLineStyle = async () => {
      const body = {
        line_color: lineColor,
        line_width: Array.isArray(lineWidth) ? lineWidth[0] : lineWidth,
        line_opacity: Array.isArray(lineOpacity) ? lineOpacity[0] : lineOpacity,
      };

      return fetch(`/api/layers/save-line?layerUid=${selectedLayer.layerUid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    };

    const savePolygonStyle = async () => {
      const body = {
        line_color: lineColor,
        line_width: Array.isArray(lineWidth) ? lineWidth[0] : lineWidth,
        line_opacity: Array.isArray(lineOpacity) ? lineOpacity[0] : lineOpacity,
        fill_color: fillColor,
        fill_opacity: Array.isArray(fillOpacity) ? fillOpacity[0] : fillOpacity,
      };

      return fetch(
        `/api/layers/save-polygon?layerUid=${selectedLayer.layerUid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
    };

    const saveAdvancedSymbolStyle = async () => {
      return fetch(
        `/api/layers/save-point-advanced?layerUid=${selectedLayer.layerUid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(JSON.parse(advancedJson)),
        }
      );
    };

    const saveAdvancedLineStyle = async () => {
      return fetch(
        `/api/layers/save-line-advanced?layerUid=${selectedLayer.layerUid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(JSON.parse(advancedJson)),
        }
      );
    };

    const saveAdvancedPolygonStyle = async () => {
      return fetch(
        `/api/layers/save-polygon-advanced?layerUid=${selectedLayer.layerUid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(JSON.parse(advancedJson)),
        }
      );
    };

    let saveFunction;
    if (tabValue === "basic") {
      if (selectedLayer.layerType === "Point") {
        saveFunction = saveSymbolStyle();
      } else if (selectedLayer.layerType === "Line") {
        saveFunction = saveLineStyle();
      } else if (selectedLayer.layerType === "Polygon") {
        saveFunction = savePolygonStyle();
      }
    } else {
      if (selectedLayer.layerType === "Point") {
        saveFunction = saveAdvancedSymbolStyle();
      } else if (selectedLayer.layerType === "Line") {
        saveFunction = saveAdvancedLineStyle();
      } else if (selectedLayer.layerType === "Polygon") {
        saveFunction = saveAdvancedPolygonStyle();
      }
    }

    saveFunction
      .then(async (response) => {
        if (!response.ok) {
          const error = new Error(response.statusText || "Unknown error");
          error.status = response.status;
          throw error;
        }

        const responseJson = await response.json();
        setChangedLayerStyleUid(responseJson.style);
        toast({
          title: "Success changing layer style",
          description: responseJson.msg || "", // Optional description if available
          variant: "success",
        });
        setToggleRefetchStyle((state) => !state);
        toggleRefreshLayerOrder(); // Assuming this function needs to be called here
        setAdvancedJson("");
      })
      .catch((error) => {
        const { title, description } = handleErrorMessage(error.status);
        toast({
          title: title,
          description: description, // Provides more specific error detail
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsSavingChanges(false);
      });
  };

  if (isFetching) {
    <div className="flex items-center justify-center w-full h-full">
      <Loader2 className="w-5 h-5 stroke-blackHaze-500 animate-spin" />
    </div>;
  }

  if (!selectedLayer || !initialStyle) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-full gap-4 p-2 overflow-y-auto">
      <DropdownMenu
        className="h-10"
        open={openDropdown}
        onOpenChange={setOpenDropdown}
      >
        <DropdownMenuTrigger asChild className="w-full">
          <button className="flex items-center gap-2 px-3 py-2 text-white rounded-md bg-nileBlue-900">
            <p className="w-full truncate">{selectedLayer.layerTitle}</p>
            <ChevronDownIcon
              className={cn("w-5 h-5 transition-all", {
                "-rotate-180": openDropdown,
              })}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0 text-white w-[224px] bg-nileBlue-900 pr-2">
          <DropdownMenuRadioGroup
            value={selectedLayer}
            onValueChange={setSelectedLayer}
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

      <Tabs defaultValue="basic" value={tabValue} onValueChange={setTabValue}>
        <TabsList className="grid w-full grid-cols-2 bg-slate-200">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="flex flex-col gap-4">
          {selectedLayer.layerType === "Point" && (
            <>
              <p className="font-semibold">Current Symbol</p>
              <SymbolComponent
                initialStyle={initialStyle}
                initialPointStyle={pointStyle}
                handlePointStyleChange={handlePointStyleChange}
                handlePointImageDataChange={handlePointImageDataChange}
                handlePointImageUrlChange={handlePointImageUrlChange}
                handlePointMarkerChange={handlePointMarkerChange}
              />
              <p className="font-semibold">Size</p>
              <SliderComponent
                initialSliderValue={parseFloat(
                  initialStyle.properties.size
                ).toFixed(1)}
                setParentSliderValue={handlePointSizeChange}
                sliderUnit={"px"}
                maxValue={50}
                stepValue={1}
              />
              <p className="font-semibold">Rotation</p>
              <SliderComponent
                initialSliderValue={parseInt(initialStyle.properties.rotation)}
                setParentSliderValue={handlePointRotationChange}
                sliderUnit={"°"}
                maxValue={360}
                stepValue={1}
              />
            </>
          )}

          {((selectedLayer.layerType === "Point" && pointStyle === "marker") ||
            selectedLayer.layerType === "Polygon") && (
            <>
              <p className="font-semibold">Fill Color</p>
              <ColorComponent
                initialColorValue={initialStyle.properties.fillColor}
                setParentColortValue={handleFillColorChange}
              />
              <p className="font-semibold">Fill Opacity</p>
              <SliderComponent
                initialSliderValue={parseFloat(
                  initialStyle.properties.fillOpacity
                ).toFixed(1)}
                setParentSliderValue={handleFillOpacitySliderChange}
                sliderUnit={"%"}
                maxValue={1}
                stepValue={0.1}
              />
            </>
          )}

          {pointStyle !== "image" && (
            <>
              <p className="font-semibold">Line Color</p>
              <ColorComponent
                initialColorValue={initialStyle.properties.lineColor}
                setParentColortValue={handleLineColorChange}
              />
              <p className="font-semibold">Line Width</p>
              <SliderComponent
                initialSliderValue={parseFloat(
                  initialStyle.properties.lineWidth
                ).toFixed(1)}
                setParentSliderValue={handleLineWidthChange}
                sliderUnit={"px"}
                maxValue={30}
                stepValue={1}
              />
              <p className="font-semibold">Line Opacity</p>
              <SliderComponent
                initialSliderValue={parseFloat(
                  initialStyle.properties.lineOpacity
                ).toFixed(1)}
                setParentSliderValue={handleLineOpacitySliderChange}
                sliderUnit={"%"}
                maxValue={1}
                stepValue={0.1}
              />
            </>
          )}
        </TabsContent>
        <TabsContent value="advanced">
          <AceEditor
            value={advancedJson}
            placeholder="Type your style here"
            mode="javascript"
            theme="xcode"
            onChange={setAdvancedJson}
            fontSize={14}
            lineHeight={19}
            showPrintMargin={false}
            showGutter={false}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
            style={{ maxWidth: "220px" }}
          />
        </TabsContent>
      </Tabs>

      <div className="h-full" />

      <Button
        className="font-bold border-none disabled:bg-neutral-100 disabled:text-neutral-400 disabled:opacity-100"
        onClick={saveStyleChanges}
        disabled={isSavingChanges}
      >
        {isSavingChanges ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 stroke-2 stroke-blackHaze-500 animate-spin" />
            <span className="font-bold">Please wait</span>
          </span>
        ) : (
          <span>Save</span>
        )}
      </Button>
    </div>
  );
};

export default StyleContent;

const SymbolComponent = (props) => {
  const {
    initialStyle,
    initialPointStyle,
    handlePointStyleChange,
    handlePointImageUrlChange,
    handlePointImageDataChange,
    handlePointMarkerChange,
  } = props;

  const [showPopup, setShowPopup] = useState(false);
  const [style, setStyle] = useState(initialPointStyle);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState(""); // State for the image source for preview

  // Local state to preview and sent to the parent component
  const [selectedShapeSymbol, setSelectedShapeSymbol] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedImageData, setSelectedImageData] = useState("");

  // Set Initial Point Style
  useEffect(() => {
    setStyle(initialPointStyle);
  }, [initialPointStyle]);

  useEffect(() => {
    setSelectedImagePreview(initialStyle.properties.imageUrl);
  }, [initialStyle.properties.imageUrl]);

  useEffect(() => {
    setSelectedShapeSymbol(initialStyle.properties.marker);
  }, [initialStyle.properties.marker]);

  useEffect(() => {
    setSelectedImagePreview(null);
  }, [style]);

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

    if (selectedShapeSymbol) {
      handlePointMarkerChange(selectedShapeSymbol);
    }

    if (selectedImageUrl) {
      handlePointImageUrlChange(selectedImageUrl);
    }

    if (selectedImageData) {
      handlePointImageDataChange(selectedImageData);
    }
  };

  const fetchAndPreviewImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");

      const imageBlob = await response.blob();
      const localUrl = URL.createObjectURL(imageBlob);

      setSelectedImagePreview(localUrl);
      setSelectedImageUrl(localUrl);
      setSelectedImageData();
    } catch (error) {
      console.error("Error loading image:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the form from being submitted
      fetchAndPreviewImage(event.target.value);
    }
  };

  const handlePaste = (event) => {
    const paste = (event.clipboardData || window.clipboardData).getData("text");
    fetchAndPreviewImage(paste);
  };

  // Handle local file input
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the file type is PNG
      if (file.type === "image/png") {
        const localUrl = URL.createObjectURL(file);
        setSelectedImagePreview(localUrl); // Set image source for preview
        setSelectedImageData(localUrl);
        setSelectedImageUrl(); // Assuming you want to clear or set this differently
      } else {
        alert("Only PNG files are accepted."); // Alert the user
      }
    }
  };

  const renderSymbol = () => {
    if (selectedShapeSymbol) {
      switch (selectedShapeSymbol) {
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
    <div className="z-20 flex flex-col items-center w-full gap-4 text-left">
      <button
        className="flex justify-between w-full gap-2 p-2 mb-4 text-base rounded-md shadow-md cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          togglePopup();
        }}
      >
        {initialPointStyle === "image" && (
          <img className="w-5 h-5" src={selectedImagePreview} alt="marker" />
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
            <span className="font-semibold">Change Symbol</span>
            <X onClick={handleClose} className="w-5 h-5 cursor-pointer" />
          </div>
          <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
            <DropdownMenuTrigger asChild className="w-full">
              <button className="flex items-center gap-2 px-3 py-2 text-white rounded-md bg-nileBlue-900">
                <p className="w-full truncate">
                  {capitalizeFirstLetter(style)}
                </p>
                <ChevronDownIcon
                  className={cn("w-5 h-5 transition-all", {
                    "-rotate-180": openDropdown,
                  })}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" text-white w-[224px] bg-nileBlue-900">
              <DropdownMenuItem
                onSelect={() => {
                  setStyle("marker");
                  setSelectedImageUrl(null);
                  setSelectedImageData(null);
                }}
              >
                Marker
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
              <div className="flex flex-col items-center justify-center w-full gap-3">
                <div className="flex items-center justify-center w-full gap-2">
                  <Input
                    type="text"
                    placeholder="Image URL"
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                  />
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }} // Hide the default file input
                    onChange={handleImageChange}
                  />
                  <Plus
                    className="cursor-pointer stroke-2 w-7 h-7"
                    onClick={() => {
                      document.getElementById("fileInput").click();
                    }}
                  />
                </div>
                {selectedImagePreview && (
                  <img
                    src={selectedImagePreview}
                    alt="Preview"
                    className="w-20 h-20"
                  />
                )}
              </div>
            )}
          </div>
          <Button onClick={handleDone}>Done</Button>
        </div>
      )}
    </div>
  );
};

const ColorComponent = (props) => {
  const { setParentColortValue, initialColorValue } = props;

  const [showPopup, setShowPopup] = useState(false);

  const [color, setColor] = useState();

  useEffect(() => {
    setColor(initialColorValue);
  }, [initialColorValue]);

  const handleDoneChangeColor = () => {
    setParentColortValue(color);
    togglePopup();
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
    <div className="relative flex flex-col w-full gap-4 py-2">
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
          className="absolute z-50 flex flex-col items-center gap-2 bg-white rounded-md w-[100%] p-2"
          onClick={handlePickerClick}
        >
          <div className="flex items-center justify-between w-full gap-2">
            <span className="font-semibold">Select color</span>
            <X onClick={handleClose} className="w-5 h-5 cursor-pointer" />
          </div>
          <SketchPicker
            color={color}
            onChangeComplete={(e) => setColor(e.hex)}
            width="180px"
          />
          <Button onClick={handleDoneChangeColor}>Done</Button>
        </div>
      )}
    </div>
  );
};

const SliderComponent = (props) => {
  const {
    setParentSliderValue,
    sliderUnit,
    initialSliderValue,
    maxValue,
    stepValue,
  } = props;

  const [sliderValue, setSliderValue] = useState(initialSliderValue);

  useEffect(() => {
    setSliderValue(initialSliderValue);
  }, [initialSliderValue]);

  const handleValueChange = (numSliderValue, numStepValue, operation) => {
    const newValue =
      operation === "increase"
        ? numSliderValue + numStepValue
        : numSliderValue - numStepValue;

    const changedValue = Number.isInteger(stepValue)
      ? newValue
      : parseFloat(newValue.toFixed(1));

    setParentSliderValue([changedValue]);

    return changedValue;
  };

  const generateSliderValue = () => {
    return Number.isInteger(stepValue)
      ? parseInt(sliderValue)
      : parseFloat(sliderValue).toFixed(1) * 100;
  };

  return (
    <div className="flex items-center w-full gap-3 p-2 mb-4 text-base rounded-md shadow-md cursor-pointer">
      <Slider
        value={[sliderValue]}
        onValueChange={(e) => {
          setParentSliderValue(e); // This to track the given value from global state
          setSliderValue(e);
        }}
        max={maxValue}
        step={stepValue}
      />
      <div className="flex items-center gap-2 px-2 rounded-md shadow-md">
        <p className="w-4">{generateSliderValue()}</p>
        <div className="flex flex-col">
          <ChevronUp
            className="w-4 h-4 cursor-pointer p-0.5"
            onClick={() => {
              let numSliderValue = parseFloat(sliderValue);
              let numStepValue = parseFloat(stepValue);
              if (numSliderValue < maxValue && numSliderValue >= 0) {
                setSliderValue(
                  handleValueChange(numSliderValue, numStepValue, "increase")
                );
              }
            }}
          />
          <ChevronDown
            className="w-4 h-4 cursor-pointer p-0.5"
            onClick={() => {
              let numSliderValue = parseFloat(sliderValue);
              let numStepValue = parseFloat(stepValue);
              if (numSliderValue <= maxValue && numSliderValue > 0) {
                setSliderValue(
                  handleValueChange(numSliderValue, numStepValue, "decrease")
                );
              }
            }}
          />
        </div>
      </div>
      <p>{sliderUnit}</p>
    </div>
  );
};
