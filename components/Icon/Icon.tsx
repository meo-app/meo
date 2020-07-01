import { ICONS } from "./SVGIconProps";
import { useTheme } from "../../application/providers/Theming";
import { Scales } from "../../foundations/Spacing";
import { Colors } from "../../foundations/Colors";

export interface Props {
  type: keyof typeof ICONS;
  size?: keyof Scales;
  color?: keyof Colors;
}

interface DefaultProps extends Required<Pick<Props, "color" | "size">> {}

const defaultProps: DefaultProps = {
  color: "foregroundPrimary",
  size: "medium",
};

function Icon(props: Props) {
  const theme = useTheme();
  const { type, size, color } = { ...defaultProps, ...props };
  const SVGIconComponent = ICONS[type];
  return (
    <SVGIconComponent
      width={theme.scales[size]}
      height={theme.scales[size]}
      color={theme.colors[color]}
    />
  );
}

export { Icon };
