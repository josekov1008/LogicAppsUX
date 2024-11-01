/* eslint-disable @typescript-eslint/no-empty-function */
import { useNodeMetadata, type AppDispatch } from '../../core';
import { useReadOnly } from '../../core/state/designerOptions/designerOptionsSelectors';
import { useIsNodeSelectedInOperationPanel } from '../../core/state/panel/panelSelectors';
import { expandDiscoveryPanel } from '../../core/state/panel/panelSlice';
import { AddActionCard, ADD_CARD_TYPE, NoActionCard } from '@microsoft/designer-ui';
import { guid } from '@microsoft/logic-apps-shared';
import { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { RecommendationPanelContext } from '../panel/recommendation/recommendationPanelContext';

const AddActionNode = ({ targetPosition = Position.Top, sourcePosition = Position.Bottom, id}: NodeProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const selected = useIsNodeSelectedInOperationPanel(id);
    const isReadOnly = useReadOnly();
    const nodeMetadata = useNodeMetadata(id);

    const openAddNodePanel = useCallback(() => {
        const newId = guid();
        const relationshipIds = { graphId: 'root' };
        dispatch(expandDiscoveryPanel({ nodeId: newId, relationshipIds, addingTrigger: true }));
    }, [dispatch]);

    return (
        <div>
            <Handle className="node-handle top" type="target" position={targetPosition} isConnectable={false} />
            <div style={{ position: 'relative', width: '800px', height:'400px'}}>
                <div
                    aria-label={'addActionCard'}
                    className="msla-panel-card-container"
                    tabIndex={0}
                    style={{ width: '100%', height: '100%', overflow: 'scroll', padding: '10px'}}
                >
                    <RecommendationPanelContext isCollapsed={false} toggleCollapse={() => {}} panelLocation={'LEFT'} isTrigger={false} relationshipIds={{parentId: nodeMetadata?.parentNodeId}} />
                </div>
            </div>
            <Handle className="node-handle bottom" type="source" position={sourcePosition} isConnectable={false} />
        </div>
    );
};

AddActionNode.displayName = 'AddActionNode';

export default memo(AddActionNode);
