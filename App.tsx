import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SQLite from "expo-sqlite";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Button,
  Image,
  KeyboardAvoidingView,
  TextInput,
  View,
} from "react-native";
import "react-native-gesture-handler";
import { Providers } from "./application/Providers";
import { useEdgeSpacing, useTheme } from "./application/Theming";
import { Font } from "./components/Font";
import { Frame } from "./components/Frame";
import { SafeStackArea } from "./components/SafeStackArea";

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
  const theme = useTheme();
  const spacing = useEdgeSpacing();

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
    <SafeStackArea>
      <View key={`items-${forceUpdateId}`}>
        {items.map((item) => (
          <Frame
            marginTop={spacing.vertical}
            justifyContent="flex-start"
            alignItems="center"
            flexDirection="row"
          >
            <Image
              style={{
                width: theme.scales.medium,
                height: theme.scales.medium,
                resizeMode: "cover",
                borderRadius: 16, // TODO: add the theme constants
              }}
              source={{
                uri: "https://i.pravatar.cc/150",
              }}
            />
            <Frame flexGrow={1} paddingLeft="medium">
              <Font key={item.id}>{item.value}</Font>
            </Frame>
          </Frame>
        ))}
      </View>
      <Button onPress={() => navigate("Create")} title="Create" />
      <Button
        title="Force reload"
        onPress={async () => {
          const items = await read();
          setItems(items);
        }}
      />
    </SafeStackArea>
  );
}

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
      <KeyboardAvoidingView
        style={{
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder="Write something"
          value={formik.values.text}
          onChangeText={(value) => formik.setFieldValue("text", value)}
          style={{
            padding: 24,
          }}
        />
        <Button
          title="Create"
          onPress={() => formik.handleSubmit()}
          disabled={!formik.isValid}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const Stack = createStackNavigator();

function Root() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{
        headerTitleStyle: {
          ...(theme.typography.display as React.ComponentProps<
            typeof Animated.Text
          >["style"]),
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="Home" component={App} />
      <Stack.Screen name="Create" component={Create} />
    </Stack.Navigator>
  );
}

const Screen: React.FunctionComponent = function Screen() {
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists items (id integer primary key not null, value text);"
      );
    });
  }, []);

  return (
    <Providers>
      <Root />
    </Providers>
  );
};

export default Screen;
