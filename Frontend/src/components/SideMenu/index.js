import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SideMenu() {
    const location = useLocation();
    const [selectedKeys, setSelectedKeys] = useState("/");

    useEffect(() => {
        const pathName = location.pathname;
        setSelectedKeys(pathName);
    }, [location.pathname]);

    const navigate = useNavigate();
    return (
        <div className="SideMenu">
            <Menu
                className="SideMenuVertical"
                mode="vertical"
                onClick={(item) => {
                    //item.key
                    navigate(item.key);
                }}
                selectedKeys={[selectedKeys]}
                items={[
                    {
                        label: "Transaction Table",
                        key: "/transaction_table",
                    },
                    {
                        label: "Transaction Statics",
                        key: "/transaction_statics",
                    },
                    {
                        label: "Statistical Chart",
                        key: "/transaction_statschart",
                    },
                    {
                        label: "Categorical Chart",
                        key: "/transaction_categorychart",
                    },
                ]}
            ></Menu>
        </div>
    );
}
export default SideMenu;
