import React, { useState } from "react";
import { 
  Check, 
  ChevronsUpDown, 
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
  },
]

const objects = ["obj1", "obj2"];

export function ComboboxDemo() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {framework.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function DemoTable() {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default function GeojsonCard() {
  const [curObjIdx, setCurObjIdx] = useState(0)

  return (
    <Card className="w-[50vw] h-[40vh]">
      <div className="flex flex-col space-y-3 px-6 pt-6 pb-3">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row">
            <ZoomIn/>
            <Label className="ml-2 mt-1 inline-block">Zoom to</Label>
          </div>
          <div className="flex items-center">
            <ChevronLeft />
            <Label>{curObjIdx+1} of {objects.length}</Label>
            <ChevronRight />
          </div>
        </div>
        <ComboboxDemo />
      </div>
      <CardContent className="flex flex-col">
        <DemoTable/>
      </CardContent>
    </Card>
  )
}