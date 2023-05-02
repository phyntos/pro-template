import { useProAccess } from '../components/ProAccess/ProAccessControl';
import { ProAccessControl } from '../pro-template';
import { DevAppRole, DevAppType, useDevTemplateContext } from './DevTemplate';

type DevAccessItem = {
    type: DevAppType;
    role: DevAppRole;
};

const accessKeys = ['Access', 'SecondAccess'] as const;

type AccessKey = Extract<(typeof accessKeys)[number], string>;

const accessControl = new ProAccessControl<AccessKey, DevAccessItem>('DevAccess');

accessControl.setAccess('Access', 'role', 'read', 'white', ['contact', 'root'], 'PROD');
accessControl.setAccess('Access', 'type', 'read', 'white', ['prod'], 'PROD');

accessControl.setAccess('Access', 'role', 'write', 'white', ['root'], 'PROD');

accessControl.setAccess('Access', 'role', 'read', 'white', ['contact', 'admin'], 'DEV');
accessControl.setAccess('Access', 'type', 'read', 'white', ['dev'], 'DEV');

accessControl.setAccess('Access', 'role', 'write', 'white', ['admin'], 'DEV');

const useDevAccess = <KeyList extends AccessKey[]>(...keys: KeyList) => {
    const { role, type } = useDevTemplateContext();

    return useProAccess(
        { role, type },
        keys,
        ({ role, type }) => !role || !type,
        ({ role }) => role === 'root',
        accessControl,
    );
};

export default useDevAccess;
