import React, { useReducer, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
} from 'react-native';
import { 
  Link,
  useParams,
  useHistory,
} from 'react-router-dom';

import { Todo } from '../models/Todo';
import { 
  fetchTodo,
  deleteTodo,
  updateTodo,
} from '../utilities/Firebase';

// State
interface State {
  todo: Todo | null;
}

// Component
interface Props {
}

export const EditTodo: React.FC<Props> = () => {
  const initialState: State = {
    todo: null,
  };

  const { todoId } = useParams();
  const history = useHistory();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (todoId) {
      fetchTodo(todoId)
        .then((todo) => {
          dispatch(fetchAction(todo));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [todoId]);

  const onNameChanged = (inputValue: string) => {
    const editTodo = Object.assign({}, state.todo, {
        name: inputValue,
    });
    dispatch(editAction(editTodo));
  };

  const onDetailChanged = (inputValue: string) => {
    const editTodo = Object.assign({}, state.todo, {
        detail: inputValue,
    });
    dispatch(editAction(editTodo));
  };

  const onSave = () => {
    const todo = state.todo;
    if (todo) {
      updateTodo(todo.id, todo.name, todo.completed, todo.detail)
        .then((todo) => {
          dispatch(saveAction(todo));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const onDelete = async (id: string) => {
    deleteTodo(id)
      .then(() => {
        history.push("/todos");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const todo: Todo | null = state.todo;
  if (todo) {
    return (
      <View style={styles.container}>
        <View style={styles.itemInnerContainer}>
          <Text style={styles.titleText}>
            ID:
          </Text>
          <Text style={styles.contentText}>
            {todo.id}
          </Text>
        </View>
        <View style={styles.itemInnerContainer}>
          <Text style={styles.titleText}>
            Name:
          </Text>
          <TextInput
            style={styles.nameTextInput}
            value={todo.name}
            placeholder={"Input your Todo"}
            selectTextOnFocus={true}
            onChangeText={onNameChanged}
          />
        </View>
        <View style={styles.itemInnerContainer}>
          <Text style={styles.titleText}>
            Completed:
          </Text>
          <Text style={styles.contentText}>
            {todo.completed ? "TRUE" : "FALSE"}
          </Text>
        </View>
        <View style={styles.itemInnerContainer}>
          <Text style={styles.titleText}>
            Detail:
          </Text>
          <TextInput
            style={styles.detailTextInput}
            value={todo.detail}
            placeholder={"Input your Todo detail"}
            placeholderTextColor={"gray"}
            multiline={true}
            onChangeText={onDetailChanged}
          />
        </View>
        
        <View style={styles.button}>
          <Button
            title="Save"
            color="#4169e1"
            onPress={onSave} />
        </View>
        <View style={styles.button}>
        <Button
          title="Delete"
          color="#dc143c"
          onPress={() => onDelete(todo.id)} />
        </View>
        <Link to="/todos">
          <Text style={styles.goBackToListText}>
            Go back to Todo list
          </Text>
        </Link>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent:'space-between',
    alignItems: "center",
    height: 64,
    padding: 16,
    borderBottomColor: "#696969",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  itemInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  titleText: {
    width: 80,
    fontSize: 12,
    fontWeight: "bold",
    color: "#808080",
  },
  contentText: {
    width: 240,
    fontSize: 20,
    color: "black",
    marginLeft: 16,
  },
  nameTextInput: {
    width: 240,
    fontSize: 22,
    color: "black",
    backgroundColor: "#f4f4f4",
    borderBottomColor: "#808080",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  detailTextInput: {
    width: 240,
    fontSize: 18,
    color: "black",
    borderWidth: 1,
    borderColor: "#808080",
    borderRadius: 4,
    marginLeft: 16,
    padding: 4,
    height: 120,
    backgroundColor: "#f4f4f4",
  },
  button: {
    height: 36,
    margin: 8,
  },
  goBackToListText: {
    margin: 8,
    fontSize: 16,
  },
});

// Action
enum ActionType {
  RequestFetch,
  Fetch,
  Edit,
  Save,
  Delete,
}

interface Action {
  type: ActionType,
  payload?: any,
}

export function requestFetchAction(): Action {
  return { type: ActionType.RequestFetch };
}

export function fetchAction(todo: Todo): Action {
  return { type: ActionType.Fetch, payload: todo };
}

export function editAction(todo: Todo): Action {
  return { type: ActionType.Edit, payload: todo };
}

export function saveAction(todo: Todo): Action {
  return { type: ActionType.Save, payload: todo };
}

export function deleteAction(todoId: string): Action {
  return { type: ActionType.Delete, payload: todoId }
}

// Reducer
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.RequestFetch: {
      return state;
    }

    case ActionType.Fetch: {
      const todo = action.payload;
      return Object.assign({}, state, {
        todo: todo,
      });
    }

    case ActionType.Edit: {
      return Object.assign({}, state, {
        todo: action.payload,
      });
    }

    case ActionType.Save: {
      const savedTodo = action.payload;
      if (savedTodo) {
        return Object.assign({}, state, {
          todo: savedTodo,
        });
      } else {
        return state;
      }
    }

    case ActionType.Delete: {
      const deletedTodoId = action.payload;
      if (deletedTodoId) {
        return Object.assign({}, state, {
          todo: null,
        });
      } else {
        return state;
      }
    }

    default:
      throw new Error();
  }
};
