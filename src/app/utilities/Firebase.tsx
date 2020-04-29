import app from 'firebase/app';
import 'firebase/firestore'

import { Todo } from '../models/Todo';

console.log("Initializing fireabase");

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

app.initializeApp(config);

const firestore = app.firestore();
const todoCollection = firestore.collection("todos");

export const fetchTodos = async () => {
  const snapshot = await todoCollection
                            .orderBy("createdAt", "desc")
                            .get();
  if (snapshot) {
    let todos: Todo[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const todo: Todo = {
        id: doc.id,
        name: data.name,
        completed: data.completed,
        detail: data.detail,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
      todos.push(todo);
    });
    return todos;
  } else {
    return [];
  }
};

export const fetchTodo = async (id: string): Promise<Todo> => {
  const doc = await todoCollection.doc(id).get();
  const todo = convertToTodo(doc);
  return todo;
};

export const addTodo = async (name: string) => {
  const docRef = await todoCollection.add({
    name: name,
    completed: false,
    detail: "",
    createdAt: app.firestore.FieldValue.serverTimestamp(),
    updatedAt: app.firestore.FieldValue.serverTimestamp(),
  });

  if (docRef) {
    const doc = await docRef.get();
    return convertToTodo(doc);
  } else {
    return null;
  }
}

export const deleteTodo = async (id: string) => {
  await todoCollection.doc(id).delete();
}

export const completeTodo = async (id: string, completed: boolean): Promise<Todo> => {
  const docRef = todoCollection.doc(id);
  await docRef.update({ 
    completed: completed,
    updatedAt: app.firestore.FieldValue.serverTimestamp(),
  });
  const doc = await docRef.get();
  const updatedTodo = convertToTodo(doc);
  return updatedTodo;
}

export const updateTodo = async (id: string, name: string, completed: boolean, detail: string): Promise<Todo> => {
  const docRef = todoCollection.doc(id);
  await docRef.update({ 
    name: name,
    completed: completed,
    detail: detail,
    updatedAt: app.firestore.FieldValue.serverTimestamp(),
  });
  const doc = await docRef.get();
  const updatedTodo = convertToTodo(doc);
  return updatedTodo;
}

function convertToTodo(doc: any): Todo {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    completed: data.completed,
    detail: data.detail,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}