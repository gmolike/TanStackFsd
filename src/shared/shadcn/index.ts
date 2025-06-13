// src/shared/shadcn/index.ts

// ================= UI COMPONENT EXPORTS =================

// Basic Components
export { Button, buttonVariants } from './button';
export type { ButtonProps } from './button';

export { Input as InputShadcn } from './input';
export type { InputProps } from './input';

export { Label } from './label';
export type { LabelProps } from './label';

// Card Components
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
export type { CardProps } from './card';

// Dialog Components
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './dialog';

// Alert Dialog Components
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';

// Select Components
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';

// Dropdown Menu Components
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

export { Calendar } from './calendar';

// Tooltip Components
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

// Form Components
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from './form';

// Avatar Components
export { Avatar, AvatarFallback, AvatarImage } from './avatar';

// Badge Component
export { Badge, badgeVariants } from './badge';
export type { BadgeProps } from './badge';

// Checkbox Component
export { Checkbox } from './checkbox';

// Switch Component
export { Switch } from './switch';

// Separator Component
export { Separator } from './separator';

// Skeleton Component
export { Skeleton } from './skeleton';

// Tabs Components
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

export {
  Table as ShadCnTable,
  TableBody as ShadCnTableBody,
  TableCell as ShadCnTableCell,
  TableHead as ShadCnTableHead,
  TableHeader as ShadCnTableHeader,
  TableRow as ShadCnTableRow,
} from './table';

export * from './textarea';

// Popover Components
export { Popover, PopoverContent, PopoverTrigger } from './popover';

// Loading Spinner Component
export { LoadingSpinner } from './loading-spinnerxx';
export type { LoadingSpinnerProps } from './loading-spinnerxx';

// Progress Component
export { Progress } from './progress';

// ScrollArea Component
export { ScrollArea, ScrollBar } from './scroll-area';

// Accordion Components
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

// Toggle Components
export { Toggle, toggleVariants } from './toggle';
export { ToggleGroup, ToggleGroupItem } from './toggle-group';

// Slider Component
export { Slider } from './slider';

// Command Components
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';

// Alert Components
export { Alert, AlertDescription, AlertTitle } from './alert';

// Aspect Ratio Component
export { AspectRatio } from './aspect-ratio';

// Context Menu Components
export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu';

// Hover Card Components
export { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

// Menubar Components
export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from './menubar';
