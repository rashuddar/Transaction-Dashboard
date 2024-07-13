import React from "react";
import { Route, Routes } from "react-router-dom";
import TransactionTable from "../../Pages/transaction_table";
// import TransactionsStatistics from "../../Pages/transaction_statics";
// import StatsChart from "../../Pages/transaction_statschart";
// import CategoryChart from "../../Pages/transaction_categorychart";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={< TransactionTable />}></Route>
            {/* <Route path="/transaction_statics" element={< TransactionsStatistics />}></Route>
            <Route path="/transaction_statschart" element={< StatsChart />}></Route>
            <Route path="/transaction_categorychart" element={< CategoryChart />}></Route> */}
        </Routes>
    )
};

export default AppRoutes;
