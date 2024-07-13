import { Badge, Image, Space, Typography } from "antd";
import { BellFilled, MailOutlined } from "@ant-design/icons"
import React from "react"

const AppHeader = () => {
    return (
        <div className="AppHeader">
            <Image width={180} src="https://roxiler.com/wp-content/uploads/2022/03/Logo.svg"></Image>
            <Typography.Title className="headertitle">Transaction Dashboard</Typography.Title>
            <Space>
                <Badge count={10} dot>
                    <MailOutlined style={{ fontSize: 24 }} />
                </Badge>
                <Badge count={20}>
                    <BellFilled style={{ fontSize: 24 }} />
                </Badge>
            </Space>
        </div>
    )
};

export default AppHeader;
