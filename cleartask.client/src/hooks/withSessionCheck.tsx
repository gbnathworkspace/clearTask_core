import React from 'react';
import { useSession } from '../hooks/useSession';

function withSessionCheck(Component: React.ComponentType<unknown>) {
    function WithSessionWrapper(props: JSX.IntrinsicAttributes & Record<string, unknown>) {
        useSession();
        return React.createElement(Component, props);
    }

    WithSessionWrapper.displayName = `WithSessionCheck(${Component.displayName || 'Component'})`;

    return WithSessionWrapper;
}

export default withSessionCheck;