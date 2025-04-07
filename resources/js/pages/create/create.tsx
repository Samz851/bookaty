import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { Create, SaveButton, UseFormReturnType, useForm, useModalForm, useSelect, useStepsForm } from "@refinedev/antd";
import {
    CreateResponse,
    HttpError,
    useBack,
    useCreateMany,
    useGetToPath,
    useGo,
    useNavigation,
    useResource,
    useTranslate
} from "@refinedev/core";
// import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import {
    DeleteOutlined,
    LeftOutlined,
    MailOutlined,
    PlusCircleOutlined,
    RollbackOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Button,
    Col,
    Form,
    FormInstance,
    FormProps,
    Input,
    InputNumber,
    List,
    Modal,
    Row,
    Select,
    Space,
    Steps,
    Switch,
    Tooltip,
    TreeSelect,
    Typography,
} from "antd";

import { CreateContextType, CreateFormPropsType } from "@/interfaces";

import { useAccountTypesSelect } from "@/hooks/useAccountTypesSelect";
import { useAccountsSelect } from "@/hooks/useAccountsSelect";
import { useState, useEffect, useMemo, useCallback } from "react";
import { FormList } from "./formList";
import { useStyles } from "./styled";
import _ from "lodash";
// import { create } from "lodash";
// import { SelectOptionWithAvatar } from "@/components";
// import { Company } from "@/graphql/schema.types";
// import {
//     CreateCompanyMutation,
//     CreateCompanyMutationVariables,
// } from "@/graphql/types";
// import { useUsersSelect } from "@/hooks/useUsersSelect";

// import { COMPANY_CREATE_MUTATION } from "./queries";

type Props = {
    isOverModal?: boolean;
};

type FormValues = {
    company_name: string;
    currency: string;
    address: string;
    contact_information?: string;
};

// type CreateFormPropsType = {
//   form: FormInstance;
//   formProps: FormProps;
//   goToForm: (resource: string) => void;
// }

// type ResourceInterface<> = 

export const CreateGeneralPage = () => {
  const { resource } = useResource();
    const getToPath = useGetToPath();
    const { create } = useNavigation();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const { key } = location;
    const navigate = useNavigate();
    const go = useGo();
    const t = useTranslate();
    const back = useBack();
    const [ selectedCreditAccount, setSelectedCreditAccount ] = useState<number>(0);
    const [ selectedDebitAccount, setSelectedDebitAccount ] = useState<number>(0);
    const [ openForms, setOpenForms ] = useState<string[]>([]);
    // const createForm = useForm(resource);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ createForms, setCreateForms ] = useState<CreateFormPropsType[]>([]);
    const { styles } = useStyles();
    const [ currentPath, setCurrentPath ] = useState('');

    const addFormStep = (values) => {
      
      const formData = {
        key: key,
        resource: resource?.name,
        values: values
      };
      // setOpenForms([...openForms, `${formData.resource} - ${formData.key}`]);
      // console.log(formData);

      setCreateForms([...createForms, formData]);
    };

    const goToCreateForm = useCallback((values, goToResource) => {
      // console.log(values);
      // console.log(createForms, key);

      if ( ! createForms.some( (form) => key === form.key) && ! _.isEmpty(values) ) {
        addFormStep(values);
      }
      create(goToResource, 'push');
    }, [key]);

    const linksCount = openForms.length - 1;

    useEffect(() => {
      setOpenForms([...openForms, `${resource?.name} - ${key}`]);
    }, [resource, key]);

    // useEffect(() => {
    //   console.log(location);
    //   console.trace();
    //   // throw new Error;
    // }, [location])

    const OpenFormsNav = () => {
      const currentLink = openForms.findIndex(form => form === `${resource?.name} - ${key}`);
      console.log(currentLink, location,openForms);
      return (
        <>
        {
              
              openForms.map((form, i) => {
                // console.log(form, location, i);
                // console.log(`i == ${i} and currentLink == ${currentLink}`);
                if ( i === currentLink ) {
                  return (
                    <Col key={i} className="acc-link current">
                      <Typography.Title level={4}>{form}</Typography.Title>
                    </Col>
                  )
                }
                if ( i > currentLink ) {
                  return (
                    <Col key={i} className="acc-link">
                    <Typography.Title onClick={() => {
                      console.log(openForms.length, i, i - linksCount);
                      navigate(i - currentLink)
                    }} level={4}>{form.toUpperCase()}</Typography.Title>
                    </Col>
                  )
                }

                if ( i < currentLink ) {
                  return (
                    <Col key={i} className="acc-link">
                    <Typography.Title onClick={() => {
                      console.log(openForms.length, i, i - linksCount);
                      navigate(i - currentLink)
                    }} level={4}>{form.toUpperCase()}</Typography.Title>
                    </Col>
                  )
                }
              })
            }
        </>
      )
    }

    
    // useEffect(() => {
    //   console.log('forms', createForms, key);
    //   // console.trace(history);
    // }, [key]);
    // useEffect(()=>{console.log("location", location, resource)}, []);
    // const getFormProps = useCallback((): CreateFormPropsType => {
    //   // if (resource) {
    //     const { onFinish, form, formProps, formLoading } = useForm({
    //       action: 'create',
    //       resource: resource?.name,
    //     })
    //     return {
    //       form,
    //       formProps: {
    //         ...formProps, 
    //         name: resource?.name
    //       }, 
    //       goToForm: goToForm,
    //       onFinish: onFinish,
    //       formLoading: formLoading
    //     }
    //   // }

    // }, [current]);
    // useEffect(() => {
    //   if ( ! createForms.some( (form) => form.formProps.name === resource?.name) ) {
    //     const { onFinish, form, formProps, formLoading, goToForm } = getFormProps()
    //     setCreateForms([
    //         ...createForms,
    //         {
    //           form,
    //           formProps: {
    //             ...formProps, 
    //             name: resource?.name
    //           }, 
    //           goToForm: goToForm,
    //           onFinish: onFinish,
    //           formLoading: formLoading
    //         }]);
    //     setLoading(formLoading);
    //   }
    // }, [ current ]);

    // const CurrentFormComponent: JSX.Element = useMemo(() => {
    //   const createFormProps: CreateFormPropsType | undefined = createForms.find(form => form.formProps.name === resource?.name);
    //   if ( createFormProps !== undefined ) {
    //     return FormList[current](createFormProps);
    //   }
    // }, [ current, loading ] );

    // const goToForm = (resource: string) => {
    //   setCurrent(resource);
    //   // getToPath(pathname.replace(current, resource));
    // }
    // const onChangeType = (newValue: string) => {
    //     console.log(newValue);
    //     setTypeValue(newValue);
    // };
    // const onChangeParent = (newValue: string) => {
    //     console.log(newValue);
    //     setParentValue(newValue);
    // };

    // const { current,
    //     gotoStep,
    //     stepsProps,
    //     formProps,
    //     saveButtonProps,
    //     queryResult, onFinish } = useStepsForm<ITransaction, HttpError, ITransaction
    // >({
    //     action: "create",
    //     warnWhenUnsavedChanges: true
    // });

    // const { data: typesData, isLoading: typesIsLoading } = useAccountTypesSelect();
    // const { queryResult: accountsQueryResult } = useSelect<IAccount>({
    //     resource: "accounts",
    //     optionLabel: "name",
    //     optionValue: "id"
    // });

    // const accountsOptions = accountsQueryResult.data?.data.map((item) => ({
    //     label: item.name,
    //     value: item.id,
    // })) ?? [];

    // const { selectProps: taxesSelectProps } = useSelect<ITax>({
    //     resource: "taxes",
    //     optionLabel: "name",
    //     optionValue: "id"
    // })
    // console.log('hash', location);
    return (
        <List
          className={styles.wrapper}
          header={
            <Row justify="space-between">
            <Col className="acc-link current">
              <Typography.Title level={4}>{`${resource?.name.toUpperCase()} - ${key}`}</Typography.Title>
            </Col>
            <Col flex="0 1 100px">
                <Tooltip title="Back" >
                  <Button 
                    icon={<RollbackOutlined />} 
                    onClick={() => back()}
                    type="primary"
                    size="large"
                  />
                </Tooltip>
              </Col>
          </Row>

          }
        >

          <Row justify="center">
            <Col span={24}>
              <Outlet context={[
                  createForms,
                  goToCreateForm,
                  openForms,
                  setOpenForms
                  ] satisfies CreateContextType}/>
            </Col>
            {/* {CurrentFormComponent} */}
          </Row>

            {/* <Form {...formProps} layout="vertical"> */}
            {/* </Form> */}
        </List>
        
        // <h1>Hello</h1>
    );
};
