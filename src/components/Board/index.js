import React from "react";
import produce from "immer";
import { loadLists } from "../../services/api";
import { Container } from "./styles";
import List from "../List";
import BoradContext from "./Context";

const data = loadLists();

export default function Board() {
  const [lists, setList] = React.useState(data);

  function move(from, to, fromList, toList) {
    setList(
      produce(lists, draft => {
        const dragged = draft[fromList].cards[from];
        draft[fromList].cards.splice(from, 1);
        draft[toList].cards.splice(to, 0, dragged);
      })
    );
  }

  return (
    <BoradContext.Provider
      value={{
        lists,
        actions: {
          move
        }
      }}
    >
      <Container>
        {lists.map((list, index) => (
          <List key={list.title} index={index} data={list} />
        ))}
      </Container>
    </BoradContext.Provider>
  );
}
