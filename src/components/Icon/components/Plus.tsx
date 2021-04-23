import React from "react";
import Svg, { Path } from "react-native-svg";
import { SVGIconProps } from "../SVGIconProps";

const Plus: React.FunctionComponent<SVGIconProps> = function Plus({
  width,
  height,
  color,
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 27 28" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.256 1.34a1.056 1.056 0 00-.384-.255 2.821 2.821 0 00-1.99-.24c-.488.117-.543.174-.583.705a.787.787 0 01-.036.135.552.552 0 00-.032.136c-.117.51-.227 1.045-.129 1.567l.091.917c.08 1.398.02 2.805-.064 4.22-.046.764-.1 1.531-.16 2.297l-.037.002c-.354.011-.725.023-1.057.015-.316-.008-.631-.02-.945-.03-.77-.028-1.534-.055-2.298-.044-.672.01-1.13-.045-1.577-.098-.27-.032-.534-.064-.839-.08-.306-.017-.613-.053-.922-.088a20.391 20.391 0 00-.733-.076c-.42-.031-.844.02-1.24.149a.5.5 0 00-.166.104 13.92 13.92 0 00-.679.684.363.363 0 00-.097.16.335.335 0 00-.002.182.747.747 0 01-.1.52c-.1.146-.133.308-.167.47-.02.102-.042.205-.08.304a.686.686 0 00.016.446c.07.27.207.524.398.742.192.219.434.397.71.522a6.075 6.075 0 002.202.61c.147.016.284.06.42.104.107.035.214.07.324.09.443.077.89.131 1.34.163l1.953.178h.596a22.3 22.3 0 012.449.149h.182l-.07 1.536c-.122 2.674-.255 5.593-.385 6.621-.1.635-.144 1.277-.132 1.919.024.457.047.493.49.571l1.843.377c.113.027.228.047.342.067.281.05.561.1.81.243.322.204.708.285 1.086.229l1.013-.103c.476-.058.641-.228.663-.726.022-.465.01-.932-.037-1.396-.108-.754-.121-1.502-.135-2.254-.004-.26-.01-.52-.018-.782l-.043-6.485a44.18 44.18 0 002.168-.219c.722-.102 1.442-.116 2.158-.13.94-.018 1.876-.036 2.806-.255l.156-.035a36.479 36.479 0 002.045-.5c.233-.07.458-.157.68-.242.204-.078.405-.156.61-.22.43-.133.381-.267.182-.535a.152.152 0 01-.057-.065.134.134 0 01-.009-.084c.013-.153-.056-.278-.127-.404a2.8 2.8 0 01-.055-.101c-.082-.164-.314-.387-.728-.283-.272.09-.559.14-.849.148a3.28 3.28 0 01.569-.226 5.55 5.55 0 00.33-.115c.298-.12.281-.164.149-.402a4.328 4.328 0 00-.397-.64l-.05-.103c-.037-.061-.11-.093-.185-.126-.126-.054-.254-.11-.212-.306.044-.207-.066-.29-.179-.375a.602.602 0 01-.152-.145c-.265-.417-.678-.536-1.224-.402-.524.126-1.052.09-1.58.054-.473-.033-.946-.065-1.416.02-.58.093-1.165.158-1.754.193-.38.03-.744.06-1.125.119-.36.064-.725.099-1.092.104a4.083 4.083 0 00-.745.044 3.89 3.89 0 01-.083.01l-.047-.588c-.033-.408-.066-.814-.095-1.216a49.749 49.749 0 00-.52-4.512c-.02-.124-.044-.247-.07-.37-.078-.386-.156-.77-.06-1.17.022-.09.017-.098-.025-.166a1.886 1.886 0 01-.093-.167 1.504 1.504 0 00-.227-.31c-.099-.114-.197-.227-.249-.364a1.055 1.055 0 00-.239-.394zm10.468 11.644a1.93 1.93 0 00-.292.08c.043-.012.086-.023.127-.032a.948.948 0 00.165-.048z"
        fill={color}
      />
    </Svg>
  );
};

export { Plus };
