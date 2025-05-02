import type { IResourceItem } from "@refinedev/core";
import {
    DashboardOutlined
} from "@ant-design/icons";


import i18next from "i18next";
import { ShowOptions } from "@/pages/options";

export const resources: IResourceItem[] = [
    {
        name: "dashboard",
        list: "/",
        meta: {
            label: "Dashboard",
            icon: <DashboardOutlined />,
        },
    },
    {
        name: "companies",
        list: "/companies",
        create: "/companies/create",
        show: "/companies/show/:id",
        meta: {
            label: i18next.t("companies.companies"),
            icon: <DashboardOutlined />,
            dataProviderName: "laravel"
        },
    },
    {
        name: "contacts",
        list: "/contacts",
        show: "/contacts/show/:id",
        create: "/contacts/create",
        meta: {
            label: i18next.t("contacts.contacts"),
            icon: <DashboardOutlined />,
            dataProviderName: "laravel"
        },
    },
    {
        name: "taxes",
        list: "/taxes",
        show: "/taxes/show/:id",
        create: "/create/taxes",
        meta: {
            label: i18next.t("taxes.taxes"),
            icon: <DashboardOutlined />,
            dataProviderName: "laravel"
        },
    },
    {
        name: "branches",
        list: "/branches",
        show: "/branches/show/:id",
        create: "/create/branches",
        meta: {
            label: i18next.t("branches.branches"),
            icon: <DashboardOutlined />,
            dataProviderName: "laravel",
            // hide: true
        }
    },
    {
        name: "accounts",
        list: "/accounts",
        create: "/create/accounts",
        show: "/accounts/show/:id",
        meta: {
            label: i18next.t("accounts.accounts"),
            icon: <DashboardOutlined />,
            dataProviderName: "laravel"
        },
    },
    {
        name: 'tags',
        list: '/tags',
        show: "/tags/show/:id",
        create: "/create/tags",
        meta: {
            label: "Tags",
            icon: <DashboardOutlined />,
            dataProviderName: "laravel"
        },
    },
    {
        name: "transactions",
        list: "/transactions",
        create: "/create/transactions",
        show: "/transactions/show/:id",
        meta: {
            label: i18next.t("transactions.transactions"),
            icon: <DashboardOutlined />,
            dataProviderName: "laravel"
        },
    },
    {
        name: "bills",
        list: "/bills",
        create: "/create/bills",
        show: "/bills/show/:id",
        meta: {
            label: i18next.t("bills.bills"),
            icon: <DashboardOutlined />,
            dataProviderName: "laravel"
        },
    },
    {
        name: "statements",
        list: "/statements",
        create: "/statements/create",
        // clone: "/reports/create/:id",
        show: "/statements/show/:id",
        meta: {
            label: i18next.t("statements.statements"),
            icon: <DashboardOutlined />,
            dataProviderName: "laravel"
        },
    },
    {
        name: "reports",
        list: "/reports",
        create: "/reports/create",
        // clone: "/reports/create/:id",
        show: "/reports/show/:id",
        edit: "/reports/edit/:id",
        // clone: "/reports/clone/:id",
        meta: {
            label: i18next.t("reports.reports"),
            icon: <DashboardOutlined />,
            dataProviderName: "laravel"
        },
    },
    {
        name: "options",
        list: "/options",
        show: "/options/show/:id",
        edit: "/options/edit/:id",
        meta: {
            hide: true,
            dataProviderName: "laravel"
        }
    },
    {
        name: "formula",
        list: "/formula",
        create: "/formula/create",
        show: "/formula/show/:id",
        meta: {
            label: "formula",
            icon: <DashboardOutlined />,
            dataProviderName: "laravel"
        }
    },
    {
        name: "dev_sample",
        list: "/dev_sample",
        create: "/dev_sample/create",
        show: "/dev_sample/show/:id",
        meta: {
            label: "dev_sample",
            icon: <DashboardOutlined />,
            dataProviderName: "laravel"
        }
    },
    {
        name: "create_general",
        list: "/create_general",
    },

]
