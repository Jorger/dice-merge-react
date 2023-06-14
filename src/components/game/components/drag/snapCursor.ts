import { getEventCoordinates } from "@dnd-kit/utilities";
import type { Modifier } from "@dnd-kit/core";

// https://docs.dndkit.com/api-documentation/modifiers#building-custom-modifiers
export const snapTopCursor: Modifier = ({
  activatorEvent,
  draggingNodeRect,
  transform,
}) => {
  if (draggingNodeRect && activatorEvent) {
    const activatorCoordinates = getEventCoordinates(activatorEvent);

    if (!activatorCoordinates) {
      return transform;
    }

    // const offsetX = activatorCoordinates.x - draggingNodeRect.left;
    const offsetY = activatorCoordinates.y - draggingNodeRect.top;

    return {
      ...transform,
      y: transform.y - offsetY,
    };
  }

  return transform;
};
