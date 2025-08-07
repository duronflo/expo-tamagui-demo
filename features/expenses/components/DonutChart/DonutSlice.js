import React, { useState, useEffect } from "react";
import { Platform } from "react-native";
import { G, Path, Defs, Stop, LinearGradient } from "react-native-svg"; // from "react-native-svg"
import { arc } from "d3-shape";
import { useTheme } from '@rneui/themed';

const isWeb = Platform.OS === "web";

const PieSlice = ({ isActive, color, arcData, onSelected, donutSize }) => {
  const { theme } = useTheme();
  const [path, setPath] = useState("");

  const activeArcLoader = arc()
    .innerRadius(donutSize / 4 + 6)
    .outerRadius(donutSize / 2 + 2 * 4);

  const arcLoader = arc()
    .outerRadius(donutSize / 2)
    .innerRadius(donutSize / 4 + 10);

  useEffect(() => {
    setPath(isActive ? activeArcLoader(arcData) : arcLoader(arcData));
  }, [isActive, arcData]);

  return (
    <G>
      <Defs>
        <LinearGradient 
        key={arcData.index} 
        id={`grad-${arcData.index}`}
        x1="0" 
        y1="0" 
        x2="0.7" 
        y2="0.6">
          <Stop offset="0" stopColor={'white'} stopOpacity="0.9" />
          <Stop offset="1" stopColor={color} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Path
        d={path}
        stroke={'white'}
        strokeWidth={1}
        fill={`url(#grad-${arcData.index})`}
        {...{ [isWeb ? "onClick" : "onPress"]: onSelected }}
        style={{ cursor: "pointer" }}
      />


    </G>
  );
};

export default PieSlice;
