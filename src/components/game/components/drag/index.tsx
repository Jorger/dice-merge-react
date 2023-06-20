import { DragEvents } from "../../../../utils/constants";
import { Draggable, Grid } from "..";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { snapTopCursor } from "./snapCursor";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React from "react";
import type {
  DiceDrag,
  DragEventsType,
  GridType,
  ScoreMessages,
} from "../../../../interfaces";

interface DragGridPops {
  gridData: GridType;
  diceDrag: DiceDrag;
  scoreMessages: ScoreMessages[];
  onRotate: () => void;
  onDragEvent: (type: DragEventsType, over: string) => void;
}

const activationConstraint = { distance: 30 };

const DragGrid = ({
  gridData,
  diceDrag,
  scoreMessages,
  onRotate,
  onDragEvent,
}: DragGridPops) => {
  const mouseSensor = useSensor(MouseSensor, { activationConstraint });
  const touchSensor = useSensor(TouchSensor, { activationConstraint });
  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext
      modifiers={[restrictToParentElement, snapTopCursor]}
      onDragOver={({ over }) =>
        onDragEvent(DragEvents.OVER, (over?.id as string) || "")
      }
      onDragEnd={({ over }) =>
        over?.id && onDragEvent(DragEvents.END, over?.id as string)
      }
      sensors={sensors}
    >
      <Grid gridData={gridData} scoreMessages={scoreMessages} />
      <Draggable diceDrag={diceDrag} onRotate={onRotate} />
    </DndContext>
  );
};

export default React.memo(DragGrid);
