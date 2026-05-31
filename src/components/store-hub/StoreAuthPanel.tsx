import type { Store } from '../../types';
import HubItemRow, { HubItemList } from './HubItemRow';
import {
  authStatusLabel,
  authStatusTone,
  type HubAction,
} from './hubStyles';

interface StoreAuthPanelProps {
  store: Store;
  onReauth: () => void;
  onUnbind: () => void;
}

export default function StoreAuthPanel({
  store,
  onReauth,
  onUnbind,
}: StoreAuthPanelProps) {
  const actions: HubAction[] = [
    { key: 'reauth', label: '重新授权', primary: true, onClick: onReauth },
    {
      key: 'unbind',
      label: '解除绑定',
      danger: true,
      onClick: onUnbind,
      confirm: {
        title: '确认解除绑定？',
        description: '解除后该店铺的数据同步也将停止',
      },
    },
  ];

  return (
    <div className="store-hub-panel store-hub-auth-panel">
      <HubItemList>
        <HubItemRow
          title="店铺授权"
          subtitle={store.bindAt ? `绑定于 ${store.bindAt}` : undefined}
          statusLabel={authStatusLabel(store.authStatus)}
          statusTone={authStatusTone(store.authStatus)}
          actions={actions}
        />
      </HubItemList>
    </div>
  );
}
