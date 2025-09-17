import React from "react";

// Import all icons
import AddRoundLight from "./AddRoundLight";
import ArrowDown from "./ArrowDown";
import CloseRoundLight from "./CloseRoundLight";
import CopyLight from "./CopyLight";
import CouponLight from "./CouponLight";
import DateRangeFill from "./DateRangeFill";
import DateTodayLight from "./DateTodayLight";
import DoneRound from "./DoneRound";
import EditLight from "./EditLight";
import ExpandDownLight from "./ExpandDownLight";
import ExpandLeftLight from "./ExpandLeftLight";
import ExpandRightLight from "./ExpandRightLight";
import ExpandUpLight from "./ExpandUpLight";
import Hamburger from "./Hamburger";
import LocationIconBlue from "./LocationIconBlue";
import LogoM from "./LogoM";
import LogoMFooter from "./LogoMFooter";
import NotebookLight from "./NotebookLight";
import OutLight from "./OutLight";
import PinFill from "./PinFill";
import RefreshLight from "./RefreshLight";
import SearchLight from "./SearchLight";
import Shop from "./Shop";
import SignOutSquareLight from "./SignOutSquareLight";
import StarFill from "./StarFill";
import StarLight from "./StarLight";
import TimeFill from "./TimeFill";
import TimeLight from "./TimeLight";
import UserDuotone from "./UserDuotone";

// Icon interface
interface IconProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

// Icon data structure
export interface IconData {
  name: string;
  component: React.ComponentType<IconProps>;
  label: string;
}

// All icons with their labels
export const allIcons: IconData[] = [
  { name: "AddRoundLight", component: AddRoundLight, label: "AddRoundLight" },
  { name: "ArrowDown", component: ArrowDown, label: "ArrowDown" },
  { name: "CloseRoundLight", component: CloseRoundLight, label: "CloseRoundLight" },
  { name: "CopyLight", component: CopyLight, label: "CopyLight" },
  { name: "CouponLight", component: CouponLight, label: "CouponLight" },
  { name: "DateRangeFill", component: DateRangeFill, label: "DateRangeFill" },
  { name: "DateTodayLight", component: DateTodayLight, label: "DateTodayLight" },
  { name: "DoneRound", component: DoneRound, label: "DoneRound" },
  { name: "EditLight", component: EditLight, label: "EditLight" },
  { name: "ExpandDownLight", component: ExpandDownLight, label: "ExpandDownLight" },
  { name: "ExpandLeftLight", component: ExpandLeftLight, label: "ExpandLeftLight" },
  { name: "ExpandRightLight", component: ExpandRightLight, label: "ExpandRightLight" },
  { name: "ExpandUpLight", component: ExpandUpLight, label: "ExpandUpLight" },
  { name: "Hamburger", component: Hamburger, label: "Hamburger" },
  { name: "LocationIconBlue", component: LocationIconBlue, label: "LocationIconBlue" },
  { name: "LogoM", component: LogoM, label: "LogoM" },
  { name: "LogoMFooter", component: LogoMFooter, label: "LogoMFooter" },
  { name: "NotebookLight", component: NotebookLight, label: "NotebookLight" },
  { name: "OutLight", component: OutLight, label: "OutLight" },
  { name: "PinFill", component: PinFill, label: "PinFill" },
  { name: "RefreshLight", component: RefreshLight, label: "RefreshLight" },
  { name: "SearchLight", component: SearchLight, label: "SearchLight" },
  { name: "Shop", component: Shop, label: "Shop" },
  { name: "SignOutSquareLight", component: SignOutSquareLight, label: "SignOutSquareLight" },
  { name: "StarFill", component: StarFill, label: "StarFill" },
  { name: "StarLight", component: StarLight, label: "StarLight" },
  { name: "TimeFill", component: TimeFill, label: "TimeFill" },
  { name: "TimeLight", component: TimeLight, label: "TimeLight" },
  { name: "UserDuotone", component: UserDuotone, label: "UserDuotone" },
];

// Icon display component
interface IconDisplayProps {
  icon: IconData;
  size?: string | number;
  color?: string;
}

export const IconDisplay: React.FC<IconDisplayProps> = ({ 
  icon, 
  size = "32", 
  color = "#000" 
}) => {
  const IconComponent = icon.component;
  
  return (
    <div className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <IconComponent width={size} height={size} color={color} />
      <span className="text-sm text-gray-600 text-center">{icon.label}</span>
    </div>
  );
};

// Icons grid component
interface IconsGridProps {
  size?: string | number;
  color?: string;
  columns?: number;
}

export const IconsGrid: React.FC<IconsGridProps> = ({ 
  size = "32", 
  color = "#000",
  columns = 4 
}) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">All Icons</h2>
      <div 
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {allIcons.map((icon, index) => (
          <IconDisplay 
            key={index} 
            icon={icon} 
            size={size} 
            color={color} 
          />
        ))}
      </div>
    </div>
  );
};

export default IconsGrid;
