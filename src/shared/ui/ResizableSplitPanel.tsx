import type { PropsWithChildren } from 'react';

import { Outlet } from '@tanstack/react-router';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/shared/shadcn';

type Props = {
  subjectId: string;
  isRightPaneVisible: boolean;
  rightPaneDefaultSize: number;
  minPaneSizeLeft: number;
  minPaneSizeRight: number;
};

/**
 * Reusable split pane component with draggable separator; used for table/detail view
 *
 * @param subjectId unique identifier for a component usage; e.g. entity name like "person", "client", "obligation"
 * @param isRightPaneVisible specifies whether the right pane (i.e. detail view) should be rendered
 * @param rightPaneDefaultSize percentage value between 1 and 99 specifying the right pane's default width
 * @param minPaneSizeLeft percentage value between 1 and 99 specifying the left pane's minimum size
 * @param minPaneSizeRight percentage value between 1 and 99 specifying the right pane's minimum size
 * @param children the component as ReactNode or JSX.Element to be rendered in the left pane;
 * @return the ResizableSplitPane component
 */

export const ResizableSplitPanel = ({
  subjectId,
  isRightPaneVisible,
  rightPaneDefaultSize,
  minPaneSizeLeft,
  minPaneSizeRight,
  children,
}: PropsWithChildren<Props>) => (
  <ResizablePanelGroup
    autoSaveId={subjectId}
    direction="horizontal"
    style={{ display: 'flex' }}
    className="gap-0"
  >
    <ResizablePanel
      id="panel-1"
      order={1}
      defaultSize={100 - (isRightPaneVisible ? rightPaneDefaultSize : 0)}
      minSize={minPaneSizeLeft}
      data-testid={`${subjectId}-panel-1`}
    >
      {children}
    </ResizablePanel>
    {isRightPaneVisible && <ResizableHandle withHandle />}
    {isRightPaneVisible && (
      <ResizablePanel
        id="panel-2"
        order={2}
        defaultSize={rightPaneDefaultSize}
        minSize={minPaneSizeRight}
        data-testid={`${subjectId}-panel-2`}
      >
        <Outlet />
      </ResizablePanel>
    )}
  </ResizablePanelGroup>
);
