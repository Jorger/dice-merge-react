import "./styles.css";
import { Bomb, Dice } from "..";
import { CSS } from "@dnd-kit/utilities";
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

  const {
    isBomb = false,
    isStar = false,
    isVisible = true,
    typeOrientation,
    orientation,
    dices,
  } = diceDrag;

  /**
   * Determina si hay una ayuda seleccionada (bomba o estrella)...
   */
  const isSpecialItem = isBomb || isStar;

  /**
   * Extrae la información de la orietación de los elementos
   * si es un ítem especial (bomba o estrella), siempre será cero
   * cuando no lo es depende de la cantidad de elementos, mínimo 1 máximo 2
   */
  const dataOrientation = !isSpecialItem
    ? DRAG_ORIENTATION[typeOrientation][orientation]
    : DRAG_ORIENTATION.SINGLE[0];

  useEffect(() => {
    document.body.style.cursor = isDragging ? "grabbing" : "auto";
  }, [isDragging]);

  const handleRotate = () => {
    if (!isDragging && typeOrientation === "MULTIPLE" && !isSpecialItem) {
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

  /**
   * Renderizar la ayuda qu esté seleccionada...
   */
  const renderHelp = isSpecialItem && (isBomb ? <Bomb /> : <Dice type={8} />);

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
        {!isSpecialItem
          ? dices.map((dice, index) => (
              <Dice
                type={dice}
                key={index}
                x={dataOrientation.dice[index].x}
                y={dataOrientation.dice[index].y}
              />
            ))
          : renderHelp}
      </div>
      {/* 
        Se muestra la base, sólo si 
        * El elemento está visible
        * No se está arrastrando.
        * Seán dos dados...
        * Y no sea una ayuda (bomba o estrella)
      */}
      {isVisible && !isDragging && dices.length === 2 && !isSpecialItem && (
        <DraggableBase />
      )}
    </React.Fragment>
  );
};

export default React.memo(Draggable);
