// lucide-react-native v1.x type fix
// The library changed its internal type from SVGSVGElement to LucideProps in v1.x
// This declaration restores the color, size, strokeWidth props we use throughout the app
declare module 'lucide-react-native' {
  import { ComponentType } from 'react';
  interface LucideProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
    fill?: string;
    absoluteStrokeWidth?: boolean;
    className?: string;
  }
  type LucideIcon = ComponentType<LucideProps>;
  // Re-export all named icons with the correct props
  export const Home: LucideIcon;
  export const History: LucideIcon;
  export const Settings: LucideIcon;
  export const User: LucideIcon;
  export const UserCog: LucideIcon;
  export const Ban: LucideIcon;
  export const X: LucideIcon;
  export const Plus: LucideIcon;
  export const Utensils: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Menu: LucideIcon;
  export const List: LucideIcon;
  export const Clock: LucideIcon;
  export const ChefHat: LucideIcon;
  export const Trash2: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Mail: LucideIcon;
  export const Lock: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Search: LucideIcon;
  export const Apple: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const Droplets: LucideIcon;
  export const Wheat: LucideIcon;
  export const Leaf: LucideIcon;
  export const Egg: LucideIcon;
  export const Shell: LucideIcon;
  export const ListFilter: LucideIcon;
}
