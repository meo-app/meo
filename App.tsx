import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import * as SQLite from "expo-sqlite";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeArea,
  initialWindowSafeAreaInsets,
} from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface Values {
  text: string;
}

const db = SQLite.openDatabase("db.db");

// https://github.com/typeorm/typeorm/blob/master/docs/supported-platforms.md#expo
function useForceUpdate(): [() => void, number] {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}

function read() {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("select * from items", [], (_, { rows }) => {
        resolve(
          [...Array(rows.length).keys()].map((index) => rows.item(index))
        );
      });
    });
  });
}

function App() {
  const { navigate } = useNavigation();
  const [items, setItems] = useState<any[]>([]);
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists items (id integer primary key not null, value text);"
      );
    });
  }, []);

  useEffect(() => {
    (async () => {
      const items = await read();
      setItems(items);
    })();
  }, [setItems, forceUpdateId]);

  return (
    <SafeAreaView>
      <View key={`items-${forceUpdateId}`}>
        {items.map((item) => (
          <Text key={item.id}>{item.value}</Text>
        ))}
      </View>
      <Button onPress={() => navigate("Create")} title="Create" />
      <Button
        onPress={async () => {
          const items = await read();
          setItems(items);
        }}
        title="Reload"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

function Create() {
  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const formik = useFormik<Values>({
    initialValues: {
      text: "",
    },
    validate: (values) => {
      if (!values.text) {
        return {
          text: "Text is required",
        };
      }
    },
    onSubmit: (values) => {
      db.transaction(
        (tx) => {
          tx.executeSql("insert into items (value) values (?)", [values.text]);
        },
        (err) => {
          console.error("something went wrong", err);
        },
        () => {
          formik.resetForm();
          forceUpdate();
        }
      );
    },
  });

  return (
    <View>
      <KeyboardAvoidingView style={styles.container}>
        <TextInput
          placeholder="Write something"
          value={formik.values.text}
          onChangeText={(value) => formik.setFieldValue("text", value)}
        />
        <Button
          title="Create"
          onPress={() => formik.handleSubmit()}
          disabled={!formik.isValid}
        />
        <Text>{JSON.stringify({ forceUpdateId })}</Text>
      </KeyboardAvoidingView>
    </View>
  );
}

const Stack = createStackNavigator();

const Screen: React.FunctionComponent = function Screen() {
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists items (id integer primary key not null, value text);"
      );
    });
  }, []);
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Stack.Navigator mode="modal">
          <Stack.Screen name="Home" component={App} />
          <Stack.Screen name="Create" component={Create} />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default Screen;
