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
import type { DiceDrag, GridType } from "../../../../interfaces";

interface DragGridPops {
  gridData: GridType;
  diceDrag: DiceDrag;
  onRotate: () => void;
}

const activationConstraint = { distance: 30 };

const DragGrid = ({ gridData, diceDrag, onRotate }: DragGridPops) => {
  const mouseSensor = useSensor(MouseSensor, { activationConstraint });
  const touchSensor = useSensor(TouchSensor, { activationConstraint });
  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext
      modifiers={[restrictToParentElement, snapTopCursor]}
      onDragOver={({ over }) => {
        console.log("onDragOver", over);
      }}
      onDragEnd={({ over }) => {
        console.log("onDragEnd", over);
      }}
      sensors={sensors}
    >
      <Grid gridData={gridData} />
      <Draggable diceDrag={diceDrag} onRotate={onRotate} />
    </DndContext>
  );
};

export default React.memo(DragGrid);
