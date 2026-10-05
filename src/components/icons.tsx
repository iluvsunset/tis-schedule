import React from 'react';
import {
  Search01Icon,
  Cancel01Icon,
  MoreVerticalIcon,
  CalendarAdd01Icon,
  PrinterIcon,
  UserMultiple02Icon,
  GlobalIcon,
  Notification01Icon,
  Notification03Icon,
  Sun03Icon,
  SunsetIcon,
  Moon02Icon,
  ComputerIcon,
  LaptopIcon,
  School01Icon,
  ArrowExpand01Icon,
  ArrowShrink02Icon,
  Calendar03Icon,
  Location01Icon,
  UserIcon,
  Clock01Icon,
  SlidersHorizontalIcon,
  Share08Icon,
  AddSquareIcon,
  SparklesIcon,
  ArrowDown01Icon,
  Mortarboard01Icon,
  CalculatorIcon,
  BookOpen01Icon,
  FlashIcon,
  TestTube01Icon,
  Leaf01Icon,
  MicroscopeIcon,
  Activity01Icon,
  FavouriteIcon,
  Coffee01Icon,
  Restaurant01Icon,
  ListViewIcon,
  GridViewIcon,
  Timer02Icon,
  CheckmarkSquare02Icon,
  PlusSignIcon,
  Delete02Icon,
  RotateLeft01Icon,
  PlayIcon,
  PauseIcon,
  PaintBoardIcon,
  Globe02Icon,
  VolumeHighIcon,
  VolumeOffIcon,
} from 'hugeicons-react';

/**
 * Central icon module.
 *
 * The whole app uses Hugeicons (https://hugeicons.com). Components import
 * friendly names from here so there is exactly ONE icon family and ONE stroke
 * weight across the UI. A slightly softer 1.8 stroke keeps the cozy-cream look
 * rounded and gentle instead of sharp and techy.
 */
export type IconProps = React.ComponentProps<typeof Search01Icon>;

const DEFAULT_STROKE = 1.8;

const wrap = (Icon: React.ComponentType<IconProps>, displayName: string) => {
  const Wrapped: React.FC<IconProps> = (props) => <Icon strokeWidth={DEFAULT_STROKE} {...props} />;
  Wrapped.displayName = displayName;
  return Wrapped;
};

// --- UI chrome ---------------------------------------------------------------
export const Search = wrap(Search01Icon, 'Search');
export const X = wrap(Cancel01Icon, 'X');
export const MoreVertical = wrap(MoreVerticalIcon, 'MoreVertical');
export const Plus = wrap(PlusSignIcon, 'Plus');
export const PlusSquare = wrap(AddSquareIcon, 'PlusSquare');
export const Trash2 = wrap(Delete02Icon, 'Trash2');
export const RotateCcw = wrap(RotateLeft01Icon, 'RotateCcw');
export const Play = wrap(PlayIcon, 'Play');
export const Pause = wrap(PauseIcon, 'Pause');
export const ArrowDown = wrap(ArrowDown01Icon, 'ArrowDown');
export const Share = wrap(Share08Icon, 'Share');
export const Maximize2 = wrap(ArrowExpand01Icon, 'Maximize2');
export const Minimize2 = wrap(ArrowShrink02Icon, 'Minimize2');
export const SlidersHorizontal = wrap(SlidersHorizontalIcon, 'SlidersHorizontal');
export const CheckSquare = wrap(CheckmarkSquare02Icon, 'CheckSquare');
export const LayoutList = wrap(ListViewIcon, 'LayoutList');
export const Grid = wrap(GridViewIcon, 'Grid');
export const Palette = wrap(PaintBoardIcon, 'Palette');
export const Volume2 = wrap(VolumeHighIcon, 'Volume2');
export const VolumeX = wrap(VolumeOffIcon, 'VolumeX');

// --- Notifications / theme ---------------------------------------------------
export const Bell = wrap(Notification01Icon, 'Bell');
export const BellRing = wrap(Notification03Icon, 'BellRing');
export const Sun = wrap(Sun03Icon, 'Sun');
export const Sunset = wrap(SunsetIcon, 'Sunset');
export const Moon = wrap(Moon02Icon, 'Moon');
export const Laptop = wrap(LaptopIcon, 'Laptop');
export const Monitor = wrap(ComputerIcon, 'Monitor');

// --- Schedule / people / places ---------------------------------------------
export const Calendar = wrap(Calendar03Icon, 'Calendar');
export const CalendarPlus = wrap(CalendarAdd01Icon, 'CalendarPlus');
export const Printer = wrap(PrinterIcon, 'Printer');
export const Users = wrap(UserMultiple02Icon, 'Users');
export const User = wrap(UserIcon, 'User');
export const Globe = wrap(GlobalIcon, 'Globe');
export const School = wrap(School01Icon, 'School');
export const GraduationCap = wrap(Mortarboard01Icon, 'GraduationCap');
export const MapPin = wrap(Location01Icon, 'MapPin');
export const Clock = wrap(Clock01Icon, 'Clock');
export const Timer = wrap(Timer02Icon, 'Timer');
export const Sparkles = wrap(SparklesIcon, 'Sparkles');

// --- Subject glyphs (used by DynamicIcon) -----------------------------------
export const Calculator = wrap(CalculatorIcon, 'Calculator');
export const BookOpen = wrap(BookOpen01Icon, 'BookOpen');
export const Zap = wrap(FlashIcon, 'Zap');
export const FlaskConical = wrap(TestTube01Icon, 'FlaskConical');
export const Leaf = wrap(Leaf01Icon, 'Leaf');
export const Microscope = wrap(MicroscopeIcon, 'Microscope');
export const Activity = wrap(Activity01Icon, 'Activity');
export const HeartHandshake = wrap(FavouriteIcon, 'HeartHandshake');
export const Coffee = wrap(Coffee01Icon, 'Coffee');
export const Utensils = wrap(Restaurant01Icon, 'Utensils');
export const Earth = wrap(Globe02Icon, 'Earth');
