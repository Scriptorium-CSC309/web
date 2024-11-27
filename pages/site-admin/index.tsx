import React, { useState, useContext, useRef, useEffect } from "react";
import Avatar from "@/frontend/components/Avatar";
import {
    StateContext as UserStateContext,
    DispatchContext as UserDispatchContext,
} from "@/frontend/contexts/UserContext";
import api from "@/frontend/utils/api";
import withAuth from "@/frontend/utils/auth";
import InfoCard from "@/frontend/components/InfoCard";
import AdminPortalLayout from "@/frontend/components/AdminPortalLayout";

const SiteAdminPage = () => {

    

    return (
        <AdminPortalLayout>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mt-4">
            <InfoCard title="Total Users" number={1000} />
            <InfoCard title="Total Blog Posts" number={100} />
            <InfoCard title="Total Code Templates" number={100} />
            </div>
        </AdminPortalLayout>
    );
};

export default withAuth(SiteAdminPage, true);
