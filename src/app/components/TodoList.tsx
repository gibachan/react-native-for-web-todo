import React, { useState, useReducer, useEffect } from 'react';
import {
  View,
  Text,
  CheckBox,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { 
  Link,
  useRouteMatch,
} from 'react-router-dom';
import { LinkToRoot } from './LinkToRoot';

import { Todo } from '../models/Todo';
import { 
  fetchTodos,
  addTodo,
  deleteTodo,
  completeTodo,
} from '../utilities/Firebase';

// State
interface State {
  isFetching: boolean;
  todos: Todo[];
}

// Component
interface TodoListProps {
}

export const TodoList: React.FC<TodoListProps> = () => {
  const initialState: State = {
    isFetching: false,
    todos: [],
  };

  const [newTodoName, setNewTodoName] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log("This method should be called just onece")
    dispatch(requestFetchAllTodosAction());
    fetchTodos()
      .then((todos) => {
        dispatch(fetchAllTodosAction(todos));
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const onAdd = (name: string) => {
    addTodo(name)
      .then((todo) => {
        if (todo) {
          dispatch(addTodoAction(todo));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onComplete = (id: string, complete: boolean) => {
    completeTodo(id, complete)
      .then((todo) => {
        dispatch(completeTodoAction(todo));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onDelete = (id: string) => {
    deleteTodo(id)
      .then(() => {
        dispatch(deleteTodoAction(id));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const indicator = state.isFetching ?
    (
      <View style={styles.fetching}>
        <ActivityIndicator 
          animating={state.isFetching}
          size={"large"}
          color={"orange"}
        />
      </View>
    ) : (<View></View>);

  return (
    <View style={styles.container}>
      {indicator}
      <FlatList
        data={state.todos}
        renderItem={({item: todo}) =>
          <TodoListItem
              todo={todo}
              onComplete={() => onComplete(todo.id, !todo.completed)}
              onDelete={() => onDelete(todo.id)}
            />
        }
       keyExtractor={(todo) => `${todo.id}` }
      ></FlatList>
      <View style={styles.addNewTodoContainer}>
        <TextInput
          style={styles.addNewTodoTextInput}
          value={newTodoName}
          placeholder={"Input your Todo detail"}
          placeholderTextColor={"gray"}
          onChangeText={setNewTodoName}
          onSubmitEditing={() => { 
            onAdd(newTodoName);
            setNewTodoName("");
          }}
        />
        <Button
          title="Add"
          color="#4169e1"
          disabled={newTodoName.length === 0}
          onPress={() => { 
            onAdd(newTodoName);
            setNewTodoName("");
          }}
        />
      </View>
      <View style={styles.linkToRoot}>
        <LinkToRoot />
      </View>
    </View>
  );
}

interface TodoListItemProps {
  todo: Todo,
  onComplete: () => void,
  onDelete: () => void,
}

const TodoListItem: React.FC<TodoListItemProps> = ({todo, onComplete, onDelete }) => {
  const match = useRouteMatch();
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemInnerContainer}>
        <CheckBox 
          style={styles.completedCheckBox}
          value={todo.completed}
          onChange={onComplete}
        />

        <Link to={`${match.path}/${todo.id}`}>
          <Text style={styles.todoText}>{todo.name}</Text>
        </Link>
      </View>

      <Button
        title="X"
        color="#dc143c"
        onPress={onDelete} />
    </View>
  );
}

// Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  fetching: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent:'space-between',
    alignItems: "center",
    height: 64,
    padding: 16,
    borderBottomColor: "#696969",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  completedCheckBox: {
    width: 32,
    height: 32,
  },
  todoText: {
    fontSize: 20,
    marginLeft: 16,
  },
  addNewTodoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    margin: 16,
    marginBottom: 16,
  },
  addNewTodoTextInput: {
    fontSize: 20,
    padding: 8,
    marginRight: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#808080",
    width: "80%",
  },
  linkToRoot: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 8,
  },
});

// Action
enum ActionType {
  RequestFetch,
  Fetch,
  Add,
  Complete,
  Update,
  Delete,
};

export interface Action {
  type: ActionType;
  payload?: any;
}

function requestFetchAllTodosAction(): Action {
  return { type: ActionType.RequestFetch };
}

function fetchAllTodosAction(todos: Todo[]): Action {
  return { type: ActionType.Fetch, payload: todos };
}

function addTodoAction(todo: Todo): Action {
  return { type: ActionType.Add, payload: todo };
}

function completeTodoAction(todo: Todo): Action {
  return { type: ActionType.Complete, payload: todo }
}

function deleteTodoAction(todoId: string): Action {
  return { type: ActionType.Delete, payload: todoId };
}

// Reducer
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.RequestFetch: {
      return Object.assign({}, state, {
        isFetching: true,
      });
    }

    case ActionType.Fetch: {
      const newTodos = action.payload;
      return Object.assign({}, state, {
        isFetching: false,
        todos: newTodos,
      });
    }

    case ActionType.Add: {
      const newTodo = action.payload;
      const newTodos = [newTodo, ...state.todos];
      return Object.assign({}, state, {
        isFetching: false,
        todos: newTodos,
      });
    }

    case ActionType.Complete: {
      const newTodos = state
                        .todos
                        .map((todo: Todo) => {
                          if (todo.id === action.payload.id) {
                            return action.payload;
                          } else {
                            return todo;
                          }
                        });
      return Object.assign({}, state, {
        isFetching: false,
        todos: newTodos,
      });
    }

    case ActionType.Update: {
      const newTodos = state
                        .todos
                        .map((todo: Todo) => {
                          if (todo.id === action.payload.id) {
                            return action.payload;
                          } else {
                            return todo;
                          }
                        });
      return Object.assign({}, state, {
        isFetching: false,
        todos: newTodos,
      });
    }

    case ActionType.Delete: {
      const newTodos = state
                        .todos
                        .filter((todo: Todo) => {
                           return todo.id !== action.payload
                        });
      return Object.assign({}, state, {
        isFetching: false,
        todos: newTodos,
      });
    }
    default:
      throw new Error();
  }
};