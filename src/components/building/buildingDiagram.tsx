"use client";

import { useState } from "react";
import Link from "next/link";
import { SquareParking } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { buildingContent, type BuildingDetail, type BuildingUnit } from "@/content/building";
import { PARKING_LEVEL_HATCH, UNIT_STATUS_COLORS } from "@/types/domain";
import { cn } from "@/lib/utils";

interface BuildingDiagramProps {
  building: BuildingDetail;
}

/**
 * Interactive cross-section: stacked floors of clickable unit blocks colored
 * by rental status, with a striped parking level at the base. Hover (desktop)
 * or tap (mobile) opens a dark popover with price and availability.
 */
export function BuildingDiagram({ building }: BuildingDiagramProps) {
  const [openUnit, setOpenUnit] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const rowAnimation = (index: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: {
      delay: 0.08 + index * 0.07,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <div className="relative rounded-3xl border border-surface-border bg-surface p-4 shadow-md sm:p-7">
      {building.floors.map((floor, index) => (
        <motion.div
          key={floor.label}
          {...rowAnimation(index)}
          className="mb-2.5 flex items-stretch gap-2.5"
        >
          <div className="flex w-9 shrink-0 items-center justify-center rounded-xl bg-base text-[13px] font-extrabold text-copy-faint sm:w-11">
            {floor.label}
          </div>
          <div
            className="grid flex-1 gap-2.5"
            style={{ gridTemplateColumns: `repeat(${floor.units.length}, 1fr)` }}
          >
            {floor.units.map((unit) => (
              <UnitBlock
                key={unit.id}
                unit={unit}
                isOpen={openUnit === unit.id}
                onOpen={() => setOpenUnit(unit.id)}
                onClose={() =>
                  setOpenUnit((current) => (current === unit.id ? null : current))
                }
                onToggle={() =>
                  setOpenUnit((current) => (current === unit.id ? null : unit.id))
                }
              />
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        {...rowAnimation(building.floors.length)}
        className="mt-1 flex items-stretch gap-2.5"
      >
        <div className="flex w-9 shrink-0 items-center justify-center rounded-xl bg-subtle text-copy-muted sm:w-11">
          <SquareParking className="h-[18px] w-[18px]" />
        </div>
        <div
          className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(58px,1fr))] gap-2 rounded-xl p-2.5"
          style={{ background: PARKING_LEVEL_HATCH }}
        >
          {building.parking.map((bay) => (
            <ParkingBay
              key={bay.id}
              bay={bay}
              isOpen={openUnit === bay.id}
              onOpen={() => setOpenUnit(bay.id)}
              onClose={() =>
                setOpenUnit((current) => (current === bay.id ? null : current))
              }
              onToggle={() =>
                setOpenUnit((current) => (current === bay.id ? null : bay.id))
              }
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

interface UnitInteractionProps {
  unit: BuildingUnit;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

function UnitBlock({ unit, isOpen, onOpen, onClose, onToggle }: UnitInteractionProps) {
  const colors = UNIT_STATUS_COLORS[unit.status];
  const isExternal = unit.status === "external";

  if (isExternal) {
    return (
      <div
        className="flex min-h-[62px] flex-col justify-center gap-1 rounded-xl border-[1.5px] px-3 py-3 sm:px-3.5"
        style={{ background: colors.fill, borderColor: colors.border }}
      >
        <span className="text-sm font-extrabold text-copy-primary">{unit.name}</span>
        <span className="text-[11.5px] font-bold" style={{ color: colors.text }}>
          {buildingContent.unitStatusLabels[unit.status]}
        </span>
      </div>
    );
  }

  return (
    <Link
      // Stub until item detail pages exist.
      href="#"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onClick={(e) => {
        e.preventDefault();
        onToggle();
      }}
      className={cn(
        "relative flex min-h-[62px] flex-col justify-center gap-1 rounded-xl border-[1.5px] px-3 py-3 transition duration-200 hover:z-10 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg sm:px-3.5",
        isOpen && "z-10"
      )}
      style={{ background: colors.fill, borderColor: colors.border }}
    >
      <span className="text-sm font-extrabold text-copy-primary">{unit.name}</span>
      <span className="text-[11.5px] font-bold" style={{ color: colors.text }}>
        {buildingContent.unitStatusLabels[unit.status]}
      </span>
      {isOpen ? <UnitPopover unit={unit} /> : null}
    </Link>
  );
}

interface ParkingBayProps {
  bay: BuildingUnit;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

function ParkingBay({ bay, isOpen, onOpen, onClose, onToggle }: ParkingBayProps) {
  const colors = UNIT_STATUS_COLORS[bay.status];

  return (
    <Link
      // Stub until item detail pages exist.
      href="#"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onClick={(e) => {
        e.preventDefault();
        onToggle();
      }}
      className={cn(
        "relative flex min-h-[46px] items-center justify-center rounded-lg border-[1.5px] text-[12.5px] font-extrabold text-copy-primary transition duration-200 hover:z-10 hover:-translate-y-0.5 hover:shadow-md",
        isOpen && "z-10"
      )}
      style={{ background: colors.fill, borderColor: colors.border }}
    >
      {bay.name}
      {isOpen ? <UnitPopover unit={bay} narrow /> : null}
    </Link>
  );
}

function UnitPopover({ unit, narrow }: { unit: BuildingUnit; narrow?: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-20 -translate-x-1/2 rounded-xl bg-copy-primary px-3.5 py-3 text-white shadow-xl",
        narrow ? "w-[200px]" : "w-[220px]"
      )}
    >
      <p className="mb-0.5 text-[13.5px] font-extrabold">{unit.name}</p>
      <p className="mb-1 text-[13px] font-bold text-subtle-border">{unit.price}</p>
      <p className="text-xs font-semibold leading-normal text-subtle-border/90">
        {unit.note}
      </p>
      <span className="absolute left-1/2 top-full -translate-x-1/2 border-x-[7px] border-t-[7px] border-x-transparent border-t-copy-primary" />
    </div>
  );
}
