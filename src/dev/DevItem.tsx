import { Col, ConfigProvider } from 'antd';
import React, { useMemo, useState } from 'react';
import ProFormCard, { useProFormCard } from '../components/ProFormCard/ProFormCard';
import { ProContainerItem, ProHeader, ProTabGroup, ProWorkflow, useProContainer } from '../pro-template';

const DevItem = () => {
    const [tab, setTab] = useState<'dev' | 'prod'>('dev');
    const [transparent, setTransparent] = useState(false);
    const [loading, setLoading] = useState(false);
    useProContainer({ title: 'dev', transparent: !transparent, loading });

    const data = useMemo(
        () => ({ dev_select: tab, dev_text: 123, dev_number: 1123, dev_date: '2022-12-12T10:45' }),
        [tab],
    );

    const [form, actions] = useProFormCard({ id: 'DEV', data, onUpdate: async (data) => console.log(data) });

    return (
        <ConfigProvider prefixCls='dev'>
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
                infos={[
                    {
                        label: 'DEV',
                        value: 'dev',
                        key: 'dev',
                        children: [
                            {
                                label: 'DEV',
                                value: 'dev',
                                key: 'dev',
                                children: [{ label: 'DEV', value: 'dev', key: 'dev', hidden: true }],
                            },
                        ],
                    },
                ]}
                onReload={() => {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                    }, 1200);
                }}
                extraCols={
                    <>
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
                        <Col>
                            <ProTabGroup
                                tab={JSON.stringify(transparent)}
                                onTabChange={(bool) => setTransparent(JSON.parse(bool))}
                                tabEnum={{
                                    true: 'ON',
                                    false: 'OFF',
                                }}
                            />
                        </Col>
                    </>
                }
                transparent={transparent}
            />
            <ProWorkflow
                transparent={transparent}
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
            <ProContainerItem transparent={transparent}>
                <ProFormCard
                    // title='DEV'
                    loading={loading}
                    transparent={transparent}
                    form={form}
                    actions={actions}
                    submitter={{ position: 'top' }}
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
                            type: 'number',
                            min: -1,
                            props: {
                                label: 'DEV Number',
                                name: 'dev_number',
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
                    transparent={transparent}
                    form={form}
                    actions={actions}
                    submitter={false}
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
                            type: 'number',
                            min: -1,
                            props: {
                                label: 'DEV Number',
                                name: 'dev_number',
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
                        {
                            type: 'date',
                            props: {
                                label: 'DEV Date',
                                name: 'dev_date',
                            },
                        },
                        {
                            type: 'item',
                            title: 'DEV_CARD',
                            children: [
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
                            ],
                            span: 16,
                        },
                        // {
                        //     type: 'submitter',
                        // },
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
                    titleExtraRender={<>123</>}
                    transparent={transparent}
                    title='sad'
                    form={form}
                    actions={actions}
                    span={8}
                    submitter={{ position: 'bottom', extraRender: <>asd</> }}
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
            </ProContainerItem>
        </ConfigProvider>
    );
};

export default DevItem;
