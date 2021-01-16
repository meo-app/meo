import React, { PropsWithChildren, useMemo } from "react";
import { FlatListProps, useWindowDimensions, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useTheme } from "../application/providers/Theming";
import { useStyles } from "../hooks/use-styles";
import { Spacing } from "./Frame";

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
}

function useGridUnitWidth({
  gap,
  margin,
  numColumns,
}: Pick<Props, "gap" | "margin" | "numColumns">) {
  const { width } = useWindowDimensions();
  const { verticalGap } = useGapValues({
    gap,
  });

  return (width - ((numColumns - 1) * verticalGap + margin * 2)) / numColumns;
}

function useGrid({
  gap,
  margin,
  numColumns,
  children,
}: PropsWithChildren<Props>) {
  const { horizontalGap, verticalGap } = useGapValues({
    gap,
  });

  const itemWidth = useGridUnitWidth({
    gap,
    margin,
    numColumns,
  });

  const styles = useStyles(() => ({
    container: {
      borderWidth: 1,
      borderColor: "red",
      marginLeft: margin,
      marginRight: margin,
      display: "flex",
      flexDirection: "column",
    },
    item: {
      position: "relative",
      overflow: "hidden",
      width: itemWidth,
      marginBottom: horizontalGap,
    },
  }));

  const data = useMemo(() => {
    const items: GridItem[] = React.Children.toArray(children).map(
      (node, index) => ({
        key: `grid-node-${index}`,
        node,
      })
    );
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

  return {
    data,
    verticalGap,
    horizontalGap,
    styles,
    itemWidth,
  };
}

interface GridItem {
  node: React.ReactNode | null;
  key: string;
}

const Grid: React.FunctionComponent<Props> = React.memo(function Grid(props) {
  const { numColumns } = props;
  const { styles, data, verticalGap } = useGrid(props);
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: "row",
          flexWrap: "wrap",
        },
      ]}
    >
      {data.map((item, index) => (
        <View
          key={item.key}
          style={[
            styles.item,
            {
              marginRight: (index + 1) % numColumns === 0 ? 0 : verticalGap,
            },
          ]}
        >
          {item.node}
        </View>
      ))}
    </View>
  );
});

function FlatListGrid<T>(
  props: Props & Omit<FlatListProps<T>, "numColumns" | "contentContainerStyle">
) {
  const { numColumns, data, renderItem, ...rest } = props;
  const { styles, verticalGap } = useGrid(props);
  return (
    <FlatList<T>
      data={data}
      numColumns={numColumns}
      contentContainerStyle={[
        styles.container,
        {
          marginLeft: 0,
        },
      ]}
      renderItem={(...args) => (
        <View
          style={[
            styles.item,
            {
              marginRight:
                (args[0].index + 1) % numColumns === 0 ? 0 : verticalGap,
            },
          ]}
        >
          {renderItem?.call(null, ...args)}
        </View>
      )}
      {...rest}
    />
  );
}

export { Grid, FlatListGrid, useGridUnitWidth };
