import React from "react";
import "../../App.css";
interface IColorMenu {
  colors: Array<string>;
  onSelectColor: (color: string) => void;
}

const ColorMenu = ({ colors, onSelectColor }: IColorMenu) => {
  return (
    <div className="color-menu">
      {colors.map((color) => (
        <div
          key={color}
          className="color-option"
          style={{ backgroundColor: color }}
          onClick={() => onSelectColor(color)}
        />
      ))}
    </div>
  );
};

export default ColorMenu;
