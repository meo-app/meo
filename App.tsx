import { useFormik } from "formik";
import * as SQLite from "expo-sqlite";
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

export default function App() {
  const [items, setItems] = useState<any[]>([]);
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

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists items (id integer primary key not null, value text);"
      );
    });
  }, []);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("select * from items", [], (_, { rows }) => {
        console.log("setting items");
        setItems(
          [...Array(rows.length).keys()].map((index) => rows.item(index))
        );
      });
    });
  }, [setItems, forceUpdateId]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <TextInput
        placeholder="Write something"
        value={formik.values.text}
        onChangeText={(value) => formik.setFieldValue("text", value)}
      />
      <Button
        title="Save"
        onPress={() => formik.handleSubmit()}
        disabled={!formik.isValid}
      />
      <Text>{JSON.stringify({ forceUpdateId })}</Text>
      <View key={`items-${forceUpdateId}`}>
        {items.map((item) => (
          <Text key={item.id}>{item.value}</Text>
        ))}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
