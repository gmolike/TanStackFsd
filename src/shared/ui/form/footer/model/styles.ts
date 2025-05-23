/**
 * CSS-Klassen für Footer-Komponente
 */
export const footerStyles = {
  container: {
    base: 'pt-6 border-t',
    sticky:
      'sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
  },

  layout: {
    default: 'space-y-4',
    compact: 'flex items-center justify-end gap-2',
    split: 'flex items-center justify-between',
    centered: 'flex flex-col items-center gap-4',
  },

  buttonContainer: {
    base: 'flex gap-2',
    centered: 'flex-col-reverse',
    compact: 'flex-row',
    default: 'flex-row-reverse',
  },

  button: {
    base: 'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      link: 'text-primary underline-offset-4 hover:underline',
      default: 'bg-background hover:bg-accent hover:text-accent-foreground',
    },
    size: {
      default: 'h-10 px-4 py-2',
      link: 'p-2',
    },
  },

  message: {
    error: {
      container: 'rounded-md border border-destructive/50 bg-destructive/10 p-3',
      wrapper: 'flex items-start gap-2',
      icon: 'mt-0.5 h-4 w-4 flex-shrink-0 text-destructive',
      text: 'text-sm text-destructive',
      list: 'list-inside list-disc space-y-1 text-destructive',
    },
    success: {
      container: 'rounded-md border border-green-500/50 bg-green-500/10 p-3',
      wrapper: 'flex items-center gap-2',
      icon: 'h-4 w-4 text-green-600',
      text: 'text-sm text-green-600',
    },
  },

  links: {
    container: 'flex flex-wrap gap-4 text-sm text-muted-foreground',
    containerCompact: 'mt-4 flex justify-center',
    link: 'underline underline-offset-4 transition-colors hover:text-foreground',
  },
} as const;
