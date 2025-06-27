import type { ReactNode } from 'react';

import { cn } from '~/shared/lib/utils';

/**
 * Diese const wird benötigt, da Tailwind während des Builds nach vorhandenen CSS-Klassen sucht und nur die gefundenen
 * erzeugt. Dadurch funktionieren dynamische Klassenzuweisungen nicht. Daher die expliziten Konstanten.
 * Weiteres ist zu finden unter: https://vue-land.github.io/faq/missing-tailwind-classes
 */
const responsiveGridOptions = {
  1: 'grid-cols-1',
  2: 'lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1',
  3: 'lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1',
  4: 'lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2',
};

/**
 * Responsive Block Component
 * @description Ein responsiver Container mit automatischer Spaltenreduktion für beliebige Inhalte
 * @param headline - Überschrift des Blocks
 * @param columnsPerRow - Maximale Anzahl Spalten auf large screens (1-4)
 * @param children - Beliebiger Inhalt des Blocks (InfoItems, andere Komponenten, etc.)
 * @param className - Optionale CSS-Klassen für den Container
 * @param headlineClassName - Optionale CSS-Klassen für die Überschrift
 * @param contentClassName - Optionale CSS-Klassen für den Inhaltsbereich
 * @param withTextOverflow - Aktiviert Text-Overflow für Kinder-Elemente (default: true)
 * @param withBorder - Zeigt Rahmen um den Block (default: true)
 * @param spacing - Abstand zwischen Elementen: 'sm' | 'md' | 'lg' (default: 'md')
 * @example
 * ```tsx
 * <ResponsiveBlock
 *   headline="Kontaktinformationen"
 *   columnsPerRow={3}
 *   withTextOverflow
 * >
 *   <InfoItem icon={<User />} label="Name" value="Max Mustermann" />
 *   <InfoItem icon={<Mail />} label="E-Mail" value="max@example.com" />
 *   <SomeOtherComponent />
 * </ResponsiveBlock>
 * ```
 */
export type ResponsiveBlockProps = {
  headline: ReactNode;
  // Falls man hier neue Werte hinzufügen möchte, muss auch in "responsiveGridOptions" ein entsprechender Wert gesetzt werden.
  columnsPerRow: 1 | 2 | 3 | 4;
  children: ReactNode;
  className?: string;
  headlineClassName?: string;
  contentClassName?: string;
  withTextOverflow?: boolean;
  withBorder?: boolean;
  spacing?: 'sm' | 'md' | 'lg';
};

const spacingOptions = {
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-6',
};

const gapOptions = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

export const ResponsiveBlock = ({
  headline,
  columnsPerRow,
  children,
  className,
  headlineClassName,
  contentClassName,
  withTextOverflow = true,
  withBorder = true,
  spacing = 'md',
}: ResponsiveBlockProps) => (
  <div
    className={cn(
      spacingOptions[spacing],
      withBorder && 'rounded border p-4',
      !withBorder && 'p-2',
      className,
    )}
  >
    <div className={cn('font-bold', headlineClassName)}>
      {withTextOverflow ? (
        <div className="truncate" title={typeof headline === 'string' ? headline : undefined}>
          {headline}
        </div>
      ) : (
        headline
      )}
    </div>
    <div
      className={cn(
        'grid',
        responsiveGridOptions[columnsPerRow],
        gapOptions[spacing],
        withTextOverflow && '[&>*]:min-w-0 [&>*]:overflow-hidden',
        contentClassName,
      )}
    >
      {children}
    </div>
  </div>
);
