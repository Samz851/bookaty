import { Dayjs } from "dayjs";
import {
    FormInstance,
    FormProps
} from "antd";
import { SetStateAction } from "react";
import { resources } from '../config/resources';
import { BaseKey } from "@refinedev/core";

export interface IOptions {
    id?: BaseKey;
    fiscal_cycle: number;
    fiscal_year_start: Date;
    description?: string;
    option_1?: string;
    option_2?: string;
    option_3?: string;
    option_4?: string;
}
export interface IOrganization {
    logo?: string;
    id: BaseKey;
    onboarded: number;
}

export interface IUser {
    id: BaseKey;
    name: string;
}
export interface IIdentity {
    user: IUser;
    organization: IOrganization;
    options: IOptions
}

export type CreateContextType = string[] | Distpatch<SetStateAction<string[]>>;
export interface IStatement {
    id: number;
    title: string;
    content: string;
}

export interface IReport {
    id: number;
    title: string;
    content: string;
    cycle?: Dayjs[];
    from?: string;
    to?: string;
    template_id?: any;
}
export interface ICompany {
    id: number;
    company_name: string;
    address: string;
    currency: string;
    contact_information?: string;
    contacts?: IContact[];
    accounts?: IAccount[];
}

export interface IFormula {
    id: number;
    name: string;
    description: string;
    formula: string;
    code: string;
}

// export type OptionsOutletContextType = {
//     meta?: {
//         id?: number;
//     },
//     resource?: string,
//     action?: string,
//     loading: boolean,
// };
export type OptionsOutletContextType = {
    id?: number;
    resource?: string,
    action?: string,
    loading: boolean,
};

export type CreateFormPropsType = {
    values: any;
    key: string;
    resource?: string;
  }

export interface DebounceSelectProps<ValueType = any> extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}
export interface IAccountsBranch extends IBaseAccount{
    children?: IAccountsBranch[];
    accounts?: IAccount[];
    debitTransactions?: TransactionTableShort[],
    creditTransactions?: TransactionTableShort[]
}

export interface TransactionTableShort {
    code: string;
    date: string;
    amount: number | string;
    crtrans?: any;
    dbtrans?: any;
    id: number;
}
export interface IAccount extends IBaseAccount{
    debit_transactions?: ITransaction[];
    credit_transactions?: ITransaction[];
    balance?: number;
    children?: IBaseAccount[] | [{}];
    debitTransactions?: TransactionTableShort[],
    creditTransactions?: TransactionTableShort[]
}

export interface ITag {
    id: number;
    label: string;
    description?: string;
    accounts?: IBaseAccount[]
}

export interface IAccountBalance {
    debit_total: number;
    credit_total: number;
    balance: number;
}
export interface IBaseAccount {
    id: number;
    name: string;
    parent?: IAccountsBranch;
    parent_id?: number;
    description?: string;
    code: string;
    has_children?: boolean;
    taxonomy: string;
    subitems?: any;
    isLeaf?: boolean;
    accounts_balance: IAccountBalance;
    tags: ITag[];
    [Symbol.iterator]?(): IterableIterator<number>;
}

export interface ITransaction {
    code: string;
    id: number;
    name?: string;
    date: string;
    description: string;
    amount: number | string;
    debit_accounts: IAccount[];
    credit_accounts: IAccount[];
    crtrans?: any;
    dbtrans?: any;
    notes_pr?: IInvoice | IBill;
    tax: ITax;
}

export interface ITransactionFilterVariables {
    q: string;
    debit_account: IAccount;
    credit_account: IAccount;
}
export interface IInvoice {
    id: number;
    issue_date: string;
    due_date: string;
    total_amount: number;
    customer: IContact;
}

export interface IBill {
    id: number;
    date: string;
    description: string;
    amount: number;
    status: string;
    due_date: string;
    notes?: string;
    vendor: IContact;
    attachments?: {
        name: string;
        type: string;
    }[];
}

export interface ITax {
    id: number;
    name: string;
    rate: number;
    total?: number;
}

export interface IContact {
    id: number;
    email: string;
    phone_number: string;
    type: string;
    company_id?: number;
    company: ICompany;
    name: string;
    accounts: IAccount[]
}

export interface ITaxFilterVariables {
    q: string;
    name: string;
}

export interface IAccountFilterVariables {
    q: string;
    name: string;
    parent: IAccountsBranch;
}

// export interface ITagFilterVariables {
//     q: string;
//     label: string;
//     parent: IAccountsBranch;
// }

export interface IOrderChart {
    count: number;
    status:
        | "waiting"
        | "ready"
        | "on the way"
        | "delivered"
        | "could not be delivered";
}

export interface IOrderTotalCount {
    total: number;
    totalDelivered: number;
}

export interface ISalesChart {
    date: string;
    title?: "Order Count" | "Order Amount";
    value: number;
}

export interface IOrderStatus {
    id: number;
    text: "Pending" | "Ready" | "On The Way" | "Delivered" | "Cancelled";
}

export interface IAddress {
    text: string;
    coordinate: [number, number];
}

export interface IFile {
    name: string;
    percent: number;
    size: number;
    status: "error" | "success" | "done" | "uploading" | "removed";
    type: string;
    uid: string;
    url: string;
}

export interface IEvent {
    date: string;
    status: string;
}

export interface IStore {
    id: number;
    title: string;
    isActive: boolean;
    createdAt: string;
    gsm: string;
    email: string;
    address: IAddress;
    products: IProduct[];
}

export interface ICourierStatus {
    id: number;
    text: "Available" | "Offline" | "On delivery";
}

export interface ICourier {
    id: number;
    name: string;
    surname: string;
    email: string;
    gender: string;
    gsm: string;
    createdAt: string;
    accountNumber: string;
    licensePlate: string;
    address: string;
    avatar: IFile[];
    store: IStore;
    status: ICourierStatus;
    vehicle: IVehicle;
}

export interface IOrder {
    id: number;
    user: IUser;
    createdAt: string;
    products: IProduct[];
    status: IOrderStatus;
    adress: IAddress;
    store: IStore;
    courier: ICourier;
    events: IEvent[];
    orderNumber: number;
    amount: number;
}

export interface IProduct {
    id: number;
    name: string;
    isActive: boolean;
    description: string;
    images: (IFile & { thumbnailUrl?: string })[];
    createdAt: string;
    price: number;
    category: {
        id: number;
    };
    stock: number;
}

export interface ICategory {
    id: number;
    title: string;
    isActive: boolean;
}

export interface IOrderFilterVariables {
    q?: string;
    store?: string;
    user?: string;
    createdAt?: [Dayjs, Dayjs];
    status?: string;
}

export interface IUserFilterVariables {
    q: string;
    status: boolean;
    createdAt: [Dayjs, Dayjs];
    gender: string;
    isActive: boolean;
}

export interface IReview {
    id: number;
    order: IOrder;
    user: IUser;
    star: number;
    createDate: string;
    status: "pending" | "approved" | "rejected";
    comment: string[];
}

export type IVehicle = {
    model: string;
    vehicleType: string;
    engineSize: number;
    color: string;
    year: number;
    id: number;
};

export interface ITrendingProducts {
    id: number;
    product: IProduct;
    orderCount: number;
}

export interface IStatementFieldsData {
    name: string | number | (string | number)[];
    value?: any;
    touched?: boolean;
    validating?: boolean;
    errors?: string[];
}

export interface IStatementFormProps {
    onChange: (fields: FieldData[]) => void;
    fields: FieldData[];
  }

export interface IBillFilterVariables {
    q: string;
    date: string;
    due_date: string;
    status: string;
    vendor: IContact;
}
