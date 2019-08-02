import React, { useRef } from "react";
import { Container, Label } from "./styles";
import { useDrag, useDrop } from "react-dnd";
import BoardContext from "./../Board/Context";

export default function Card({ data, index, listIndex }) {
  const ref = useRef();
  const board = React.useContext(BoardContext);
  const [props, dragRef] = useDrag({
    item: {
      type: "CARD",
      index,
      listIndex
      // content: data.content,
      // id: data.id
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, dropRef] = useDrop({
    accept: "CARD",
    hover(item, monitor) {
      const draggedIndex = item.index;
      const targetIndex = index;
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;

      if (draggedIndex === targetIndex && draggedListIndex === targetListIndex)
        return;

      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = targetSize.bottom - targetSize.top / 2;
      const draggedoOffSet = monitor.getClientOffset();
      const draggedTop = draggedoOffSet.y - targetSize.top;

      if (draggedIndex < targetIndex && draggedTop < targetCenter) return;

      if (draggedIndex > targetIndex && draggedTop > targetCenter) return;

      board.actions.move(
        draggedIndex,
        targetIndex,
        draggedListIndex,
        targetListIndex
      );

      item.index = targetIndex;
      item.listIndex = targetListIndex;
    }
  });

  dragRef(dropRef(ref));

  return (
    <Container ref={ref} isDragging={props.isDragging}>
      <header>
        {data.labels.map(label => (
          <Label color={label} key={label} />
        ))}
      </header>
      <p>{data.content}</p>
      {data.user && <img src={data.user} alt="Avatar" />}
    </Container>
  );
}
