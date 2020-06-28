import React, { useEffect, useContext } from "react";
import * as SQLite from "expo-sqlite";
import { WebSQLDatabase } from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

interface SQLiteContextInterface {
  db: WebSQLDatabase;
}

const Context = React.createContext<SQLiteContextInterface>({
  db,
});

const SQLiteProvider: React.FunctionComponent = function SQLiteProvider({
  children,
}) {
  const { db } = useContext(Context);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists posts (id integer primary key not null, value text);"
      );
    });
  }, [db]);

  return <Context.Provider value={{ db }}>{children}</Context.Provider>;
};

function useDB() {
  return useContext(Context).db;
}

export { SQLiteProvider, useDB };
