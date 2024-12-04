import React from 'react';
import { Table as AntdTable, Transfer as AntdTransfer } from 'antd';

import './TableTransfer.css';

// eslint-disable-next-line react/prop-types
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => {
    return (
        <AntdTransfer {...restProps}>
            {({
                direction,
                filteredItems,
                onItemSelectAll,
                onItemSelect,
                selectedKeys: listSelectedKeys,
                disabled: listDisabled,
            }) => {
                const columns = direction === 'left' ? leftColumns : rightColumns;
                const rowSelection = {
                    getCheckboxProps: () => ({
                        disabled: listDisabled,
                    }),
                    onChange: selectedRowKeys => {
                        onItemSelectAll(selectedRowKeys, 'replace');
                    },
                    selectedRowKeys: listSelectedKeys,
                };
                return (
                    <AntdTable
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={filteredItems}
                        size="small"
                        pagination={false}
                        scroll={restProps.scroll || { y: 225 }}
                        style={{
                            pointerEvents: listDisabled ? 'none' : undefined,
                        }}
                        onRow={({ key }) => ({
                            onClick: () => {
                                if (listDisabled) return;
                                onItemSelect(key, !listSelectedKeys.includes(key));
                            },
                        })}
                    />
                );
            }}
        </AntdTransfer>
    );
};

export default TableTransfer;
