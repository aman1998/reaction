"use client";

import { SlidersHorizontal } from "lucide-react";

import { GenerationOptions } from "@/components/style/GenerationOptions";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function StyleSettingsDrawer() {
  return (
    <Drawer swipeDirection="right" showSwipeHandle>
      <DrawerTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Style settings"
          />
        }
      >
        <SlidersHorizontal />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Style</DrawerTitle>
          <DrawerDescription>
            Options apply to the next conversion and update existing results
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4 mt-4">
          <GenerationOptions />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
