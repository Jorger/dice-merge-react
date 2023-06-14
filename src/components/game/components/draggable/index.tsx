import "./styles.css";
import { CSS } from "@dnd-kit/utilities";
import { Dice } from "..";
import { DRAG_ORIENTATION } from "../../../../utils/constants";
import { useDraggable } from "@dnd-kit/core";
import DraggableBase from "./base";
import React, { useEffect } from "react";
import type { DiceDrag } from "../../../../interfaces";

interface DraggableProps {
  diceDrag: DiceDrag;
  onRotate: () => void;
}

const Draggable = ({ diceDrag, onRotate }: DraggableProps) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({ id: "drag" });

  const { isVisible, typeOrientation, orientation, dices } = diceDrag;

  /**
   * Extrae la información de la orietación de los elementos
   * si es un ítem especial (bomba o estrella), siempre será cero
   * cuando no lo es depende de la cantidad de elementos, mínimo 1 máximo 2
   */
  const dataOrientation = DRAG_ORIENTATION[typeOrientation][orientation];

  useEffect(() => {
    document.body.style.cursor = isDragging ? "grabbing" : "auto";
  }, [isDragging]);

  const handleRotate = () => {
    if (!isDragging && typeOrientation === "MULTIPLE") {
      onRotate();
    }
  };

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  const draggableStyles = dataOrientation.parent;

  // console.log("Draggable - diceDrag", diceDrag);

  const className = `draggable-wrapper ${!isVisible ? "hide" : ""} ${
    isDragging ? "dragging" : ""
  } orientation-${orientation}`;

  return (
    <React.Fragment>
      <div
        className={className}
        ref={setNodeRef}
        style={{
          ...style,
          ...draggableStyles,
          transition: !isDragging ? "all 140ms ease" : "none",
        }}
        {...listeners}
        {...attributes}
        onMouseUp={handleRotate}
        onTouchCancel={handleRotate}
      >
        {dices.map((dice, index) => (
          <Dice
            type={dice}
            key={index}
            x={dataOrientation.dice[index].x}
            y={dataOrientation.dice[index].y}
          />
        ))}
      </div>
      {/* 
        Se muestra la base, sólo si 
        * El elemento está visible
        * No se está arrastrando.
        * Seán dos dados...
        * Y no sea una ayuda (bomba o estrella)
      */}
      {isVisible && !isDragging && dices.length === 2 && <DraggableBase />}
    </React.Fragment>
  );
};

export default React.memo(Draggable);
