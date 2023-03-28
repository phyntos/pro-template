import { Card, Col } from 'antd';
import React, { useMemo, useState } from 'react';
import ProFormCard, { useProFormCard } from '../components/ProFormCard/ProFormCard';
import { ProHeader, ProTabGroup, ProWorkflow } from '../pro-template';

const DevItem = () => {
    const [tab, setTab] = useState<'dev' | 'prod'>('dev');

    const data = useMemo(() => ({ dev_select: tab, dev_text: 123 }), [tab]);

    const [form, actions] = useProFormCard({ id: 'DEV', data, onUpdate: async (data) => console.log(data) });

    return (
        <>
            <ProHeader
                back
                title='DEV'
                actionItems={[
                    {
                        key: 'dev',
                        label: 'DEV',
                        modalFields: [
                            {
                                type: 'input',
                                label: 'DEV',
                                name: 'dev',
                            },
                        ],
                    },
                ]}
                infos={[{ label: 'DEV', value: 'dev', key: 'dev' }]}
                onReload={() => {
                    console.log('UPDATED');
                }}
                extraCols={
                    <Col>
                        <ProTabGroup
                            tab={tab}
                            onTabChange={setTab}
                            tabEnum={{
                                dev: 'DEV',
                                prod: 'PROD',
                            }}
                        />
                    </Col>
                }
                transparent
            />
            <ProWorkflow
                // transparent
                workflows={[
                    { active: true, done: false, order: 1, slaMinutes: 0, statusCode: 'CODE', statusName: 'Status 1' },
                    {
                        active: false,
                        done: false,
                        order: 2,
                        slaMinutes: 0,
                        statusCode: 'CODE_2',
                        statusName: 'Status 2',
                    },
                    {
                        active: false,
                        done: false,
                        order: 3,
                        slaMinutes: 0,
                        statusCode: 'CODE_3',
                        statusName: 'Status 3',
                    },
                    {
                        active: false,
                        done: false,
                        order: 4,
                        slaMinutes: 0,
                        statusCode: 'CODE_4',
                        statusName: 'Status 4',
                    },
                ]}
            />
            <Card>
                <ProFormCard
                    // transparent
                    form={form}
                    actions={actions}
                    submitter={{ position: 'bottom' }}
                    span={8}
                    fields={[
                        {
                            type: 'text',
                            props: {
                                label: 'DEV Text',
                                name: 'dev_text',
                            },
                        },
                        {
                            type: 'select',
                            props: {
                                label: 'DEV Select',
                                name: 'dev_select',
                                valueEnum: {
                                    dev: 'DEV',
                                    prod: 'PROD',
                                },
                            },
                        },
                    ]}
                />
                <ProFormCard
                    // transparent
                    form={form}
                    actions={actions}
                    submitter={{ position: 'bottom' }}
                    span={8}
                    fields={[
                        {
                            type: 'text',
                            props: {
                                label: 'DEV Text',
                                name: 'dev_text',
                            },
                        },
                        {
                            type: 'select',
                            props: {
                                label: 'DEV Select',
                                name: 'dev_select',
                                valueEnum: {
                                    dev: 'DEV',
                                    prod: 'PROD',
                                },
                            },
                        },
                    ]}
                />
            </Card>
        </>
    );
};

export default DevItem;
