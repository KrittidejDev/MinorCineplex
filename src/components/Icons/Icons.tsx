import React from "react";

// Import all icons
import AddRoundLight from "./AddRoundLight";
import ArrowDown from "./ArrowDown";
import Banner from "./Banner";
import BuildingFill from "./BuildingFill";
import BxsUser from "./BxsUser";
import Cinema from "./Cinema";
import CinemaWatch from "./CinemaWatch";
import CloudUpload from "./CloudUpload";
import CloseRoundLight from "./CloseRoundLight";
import CopyLight from "./CopyLight";
import CouponLight from "./CouponLight";
import Dashboard from "./Dashboard";
import DateRangeFill from "./DateRangeFill";
import DateTime from "./DateTime";
import DateTodayLight from "./DateTodayLight";
import DoneRound from "./DoneRound";
import EditLight from "./EditLight";
import ExpandDownLight from "./ExpandDownLight";
import ExpandLeftLight from "./ExpandLeftLight";
import ExpandRightLight from "./ExpandRightLight";
import ExpandUpLight from "./ExpandUpLight";
import Eye from "./Eye";
import Hall from "./Hall";
import Hamburger from "./Hamburger";
import IconCircle from "./IconCircle";
import Link from "./Link";
import LocationIconBlue from "./LocationIconBlue";
import LogoM from "./LogoM";
import LogoMFooter from "./LogoMFooter";
import Minus from "./Minus";
import MoneyBag from "./MoneyBag";
import MovieLine from "./MovieLine";
import NotebookLight from "./NotebookLight";
import OutLight from "./OutLight";
import PinFill from "./PinFill";
import Play from "./Play";
import RefreshLight from "./RefreshLight";
import Revenue from "./Revenue";
import SearchLight from "./SearchLight";
import SeatAvailable from "./SeatAvailable";
import SeatBooked from "./SeatBooked";
import SeatFriend from "./SeatFriend";
import SeatReserved from "./SeatReserved";
import SeatSelected from "./SeatSelected";
import Shop from "./Shop";
import Showing from "./Showing";
import SignOutSquareLight from "./SignOutSquareLight";
import StarFill from "./StarFill";
import StarLight from "./StarLight";
import TimeFill from "./TimeFill";
import TimeLight from "./TimeLight";
import Trash from "./Trash";
import UploadFile from "./UploadFile";
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
  { name: "Banner", component: Banner, label: "Banner" },
  { name: "BuildingFill", component: BuildingFill, label: "BuildingFill" },
  { name: "BxsUser", component: BxsUser, label: "BxsUser" },
  { name: "Cinema", component: Cinema, label: "Cinema" },
  { name: "CinemaWatch", component: CinemaWatch, label: "CinemaWatch" },
  { name: "CloudUpload", component: CloudUpload, label: "CloudUpload" },
  { name: "CloseRoundLight", component: CloseRoundLight, label: "CloseRoundLight" },
  { name: "CopyLight", component: CopyLight, label: "CopyLight" },
  { name: "CouponLight", component: CouponLight, label: "CouponLight" },
  { name: "Dashboard", component: Dashboard, label: "Dashboard" },
  { name: "DateRangeFill", component: DateRangeFill, label: "DateRangeFill" },
  { name: "DateTime", component: DateTime, label: "DateTime" },
  { name: "DateTodayLight", component: DateTodayLight, label: "DateTodayLight" },
  { name: "DoneRound", component: DoneRound, label: "DoneRound" },
  { name: "EditLight", component: EditLight, label: "EditLight" },
  { name: "ExpandDownLight", component: ExpandDownLight, label: "ExpandDownLight" },
  { name: "ExpandLeftLight", component: ExpandLeftLight, label: "ExpandLeftLight" },
  { name: "ExpandRightLight", component: ExpandRightLight, label: "ExpandRightLight" },
  { name: "ExpandUpLight", component: ExpandUpLight, label: "ExpandUpLight" },
  { name: "Eye", component: Eye, label: "Eye" },
  { name: "Hall", component: Hall, label: "Hall" },
  { name: "Hamburger", component: Hamburger, label: "Hamburger" },
  { name: "IconCircle", component: () => <IconCircle icon={PinFill} />, label: "IconCircle" },
  { name: "Link", component: Link, label: "Link" },
  { name: "LocationIconBlue", component: LocationIconBlue, label: "LocationIconBlue" },
  { name: "LogoM", component: LogoM, label: "LogoM" },
  { name: "LogoMFooter", component: LogoMFooter, label: "LogoMFooter" },
  { name: "Minus", component: Minus, label: "Minus" },
  { name: "MoneyBag", component: MoneyBag, label: "MoneyBag" },
  { name: "MovieLine", component: MovieLine, label: "MovieLine" },
  { name: "NotebookLight", component: NotebookLight, label: "NotebookLight" },
  { name: "OutLight", component: OutLight, label: "OutLight" },
  { name: "PinFill", component: PinFill, label: "PinFill" },
  { name: "Play", component: Play, label: "Play" },
  { name: "RefreshLight", component: RefreshLight, label: "RefreshLight" },
  { name: "Revenue", component: Revenue, label: "Revenue" },
  { name: "SearchLight", component: SearchLight, label: "SearchLight" },
  { name: "SeatAvailable", component: SeatAvailable, label: "SeatAvailable" },
  { name: "SeatBooked", component: SeatBooked, label: "SeatBooked" },
  { name: "SeatFriend", component: SeatFriend, label: "SeatFriend" },
  { name: "SeatReserved", component: SeatReserved, label: "SeatReserved" },
  { name: "SeatSelected", component: SeatSelected, label: "SeatSelected" },
  { name: "Shop", component: Shop, label: "Shop" },
  { name: "Showing", component: Showing, label: "Showing" },
  { name: "SignOutSquareLight", component: SignOutSquareLight, label: "SignOutSquareLight" },
  { name: "StarFill", component: StarFill, label: "StarFill" },
  { name: "StarLight", component: StarLight, label: "StarLight" },
  { name: "TimeFill", component: TimeFill, label: "TimeFill" },
  { name: "TimeLight", component: TimeLight, label: "TimeLight" },
  { name: "Trash", component: Trash, label: "Trash" },
  { name: "UploadFile", component: UploadFile, label: "UploadFile" },
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
      <div className="text-white">
        <IconComponent width={size} height={size} />
      </div>
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
          />
        ))}
      </div>
    </div>
  );
};

export default IconsGrid;

// Export all icons for easy importing
export {
  AddRoundLight,
  ArrowDown,
  Banner,
  BuildingFill,
  BxsUser,
  Cinema,
  CinemaWatch,
  CloudUpload,
  CloseRoundLight,
  CopyLight,
  CouponLight,
  Dashboard,
  DateRangeFill,
  DateTime,
  DateTodayLight,
  DoneRound,
  EditLight,
  ExpandDownLight,
  ExpandLeftLight,
  ExpandRightLight,
  ExpandUpLight,
  Eye,
  Hall,
  Hamburger,
  IconCircle,
  Link,
  LocationIconBlue,
  LogoM,
  LogoMFooter,
  Minus,
  MoneyBag,
  MovieLine,
  NotebookLight,
  OutLight,
  PinFill,
  Play,
  RefreshLight,
  Revenue,
  SearchLight,
  SeatAvailable,
  SeatBooked,
  SeatFriend,
  SeatReserved,
  SeatSelected,
  Shop,
  Showing,
  SignOutSquareLight,
  StarFill,
  StarLight,
  TimeFill,
  TimeLight,
  Trash,
  UploadFile,
  UserDuotone,
};
