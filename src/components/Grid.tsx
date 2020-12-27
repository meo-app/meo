import React, { useMemo } from "react";
import { useWindowDimensions, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useTheme } from "../application/providers/Theming";
import { useStyles } from "../hooks/use-styles";
import { Spacing } from "./Frame";
import { Font } from "./Font";

function useGapValues({ gap }: { gap: Spacing }) {
  const theme = useTheme();
  let horizontalGap: number;
  let verticalGap: number;
  if (Array.isArray(gap)) {
    horizontalGap =
      gap[0] === "none" || gap[0] === undefined ? 0 : theme.units[gap[0]];
    verticalGap =
      gap[1] === "none" || gap[1] === undefined ? 0 : theme.units[gap[1]];
  } else {
    const gridGap = gap === "none" || gap === undefined ? 0 : theme.units[gap];
    horizontalGap = gridGap;
    verticalGap = gridGap;
  }

  return {
    horizontalGap,
    verticalGap,
  };
}

interface Props {
  numColumns: number;
  margin: number;
  gap: Spacing;
  /**
   * Will make use of FlatList instead so items are optmized by it.
   * Note that parent component should be a virtualized list (Eg. ScrollView/FlatList)
   */
  virtualized?: boolean;
}

const Grid: React.FunctionComponent<Props> = function Grid({
  children,
  gap,
  numColumns,
  margin,
  virtualized,
}) {
  const { width } = useWindowDimensions();
  const { horizontalGap, verticalGap } = useGapValues({
    gap,
  });
  const itemWidth = Math.floor(
    (width - ((numColumns - 1) * verticalGap + 2 * margin)) / numColumns
  );
  const styles = useStyles((theme) => ({
    container: {
      marginLeft: margin,
      marginRight: margin,
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
    },
    item: {
      width: itemWidth,
      marginBottom: horizontalGap,
    },
  }));

  const data = useMemo(() => {
    const items: {
      node: React.ReactNode | null;
      key: string;
    }[] = React.Children.toArray(children).map((node, index) => ({
      key: `grid-node-${index}`,
      node,
    }));
    const rows = Math.floor(items.length / numColumns);
    if (items.length % rows !== 0) {
      const extraViews = items.length + 1 - rows * numColumns;
      for (let i = 0; i < extraViews; i++) {
        items.push({
          key: `empty-${i}`,
          node: null,
        });
      }
    }
    return items;
  }, [children, numColumns]);

  if (virtualized) {
    return (
      <FlatList
        data={data}
        numColumns={numColumns}
        contentContainerStyle={styles.container}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View
            style={[
              styles.item,
              {
                marginRight: verticalGap,
              },
            ]}
          >
            {item.node}
          </View>
        )}
      />
    );
  }

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View
          key={item.key}
          style={[
            styles.item,
            {
              marginRight: index % numColumns === 0 ? verticalGap : 0,
            },
          ]}
        >
          {item.node}
        </View>
      ))}
    </View>
  );
};

export { Grid };
