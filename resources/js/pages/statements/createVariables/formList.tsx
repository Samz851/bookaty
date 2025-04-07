import { LogoUpload } from "@/components/upload";
import { AccountCreatePage } from "../accounts";
import { AccountsBranchCreatePage } from "../accountsBranches";
import { TransactionCreatePage } from "../transactions";
import { Form, Input, InputNumber, DatePicker } from "antd";
import { getValueFromEvent } from "@refinedev/antd";
// import { AccountStep } from "./forms/account";
// import { BranchStep } from "./forms/branch";
// import { TransactionStep } from "./forms/transaction";
const normFile = (e) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
export const FormList = [
    <>
        <LogoUpload />
      <Form.Item
        label="description"
        name="description"
        required={true}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      </>,
      <>
      <Form.Item
        label="option_1"
        name="option_1"
      >
        <Input />
      </Form.Item>
        <Form.Item
            label="option_2"
            name="option_2"
            >
            <Input />
        </Form.Item>
        <Form.Item
            label="option_3"
            name="option_3"
            >
                <Input />
        </Form.Item>
        <Form.Item
            label="option_4"
            name="option_4"
            >
                <Input />
        </Form.Item>
    
    </>,
    <>
      <Form.Item
      label="fiscal_cycle"
      name="fiscal_cycle"
      >
        <InputNumber max={12} />
      </Form.Item>
        <Form.Item
            label="fiscal_year_start"
            name="fiscal_year_start"
            >
                <DatePicker />
        </Form.Item>
    </>,
]