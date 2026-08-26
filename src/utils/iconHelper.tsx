import React from 'react';
import {
  Calculator,
  Globe,
  BookOpen,
  Zap,
  FlaskConical,
  Leaf,
  Laptop,
  Microscope,
  Activity,
  HeartHandshake,
  Sparkles,
  Coffee,
  Sun,
  Sunset,
  Utensils,
  Search,
  CalendarPlus,
  Printer,
  SlidersHorizontal,
  Clock,
  LayoutList,
  Grid,
  Users,
  Timer,
  CheckSquare,
  Plus,
  Trash2,
  RotateCcw,
  Play,
  Pause,
  MapPin,
  Palette,
  X,
  GraduationCap
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
}

export const DynamicIcon: React.FC<IconProps> = ({ name, className = "w-5 h-5" }) => {
  const iconMap: Record<string, React.ElementType> = {
    Calculator,
    Globe,
    BookOpen,
    Zap,
    FlaskConical,
    Leaf,
    Laptop,
    Microscope,
    Activity,
    HeartHandshake,
    Sparkles,
    Coffee,
    Sun,
    Sunset,
    Utensils,
    Search,
    CalendarPlus,
    Printer,
    SlidersHorizontal,
    Clock,
    LayoutList,
    Grid,
    Users,
    Timer,
    CheckSquare,
    Plus,
    Trash2,
    RotateCcw,
    Play,
    Pause,
    MapPin,
    Palette,
    X,
    GraduationCap
  };

  const Component = iconMap[name] || Sparkles;
  return <Component className={className} />;
};
