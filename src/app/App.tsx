import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

import { NavigationBar } from './components/NavigationBar';
import { TodoList } from './components/TodoList';
import { EditTodo } from './components/EditTodo';

function App() {
  return (
    <Router>
      <View style={styles.container}>
        <NavigationBar />
        <Switch>
          <Route path="/todos/:todoId">
            <EditTodo />
          </Route>
          <Route path="/todos">
            <TodoList />
          </Route>
          <Route path="/">
            <Link to="/todos">
              <View style={styles.link}>
                <Text style={styles.linkText}>
                  Go to your TODO list
                </Text>
              </View>
            </Link>
          </Route>
        </Switch>
      </View>
    </Router>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#eeeeee"
  },
  link: {
    margin: 16,
  },
  linkText: {
    color: "#191970",
    fontSize: 24,
  },
});

export default App;