import { ConfigProvider, Steps } from 'antd';
import React from 'react';
import './ProWorkflow.scss';
import { ProContainerItem } from '../../pro-template';

export type WorkflowVM<StatusCodes> = {
    active: boolean;
    done: boolean;
    order: number;
    slaMinutes: number;
    statusCode: StatusCodes;
    statusName: string;
};

const ProWorkflow = <StatusCodes extends string>({
    workflows,
    rejectedStatusCodes,
    transparent,
}: {
    workflows: WorkflowVM<StatusCodes>[] | undefined;
    rejectedStatusCodes?: StatusCodes[];
    transparent?: boolean;
}) => {
    return (
        <ConfigProvider prefixCls='pro-workflow'>
            <ProContainerItem className='pro-workflow' transparent={transparent}>
                <Steps
                    size='small'
                    current={workflows?.findIndex((workflow) => workflow.active)}
                    items={workflows?.map((workflow) => ({
                        title: workflow.statusName,
                        status: rejectedStatusCodes?.includes(workflow.statusCode)
                            ? 'error'
                            : workflow.done
                            ? 'finish'
                            : undefined,
                    }))}
                />
            </ProContainerItem>
        </ConfigProvider>
    );
};

export default ProWorkflow;
