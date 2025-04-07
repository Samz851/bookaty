import { Create, Edit, List, SaveButton, useStepsForm, useThemedLayoutContext } from "@refinedev/antd"
import { Button, Form, FormInstance, Row, Space, Steps } from "antd"
import { useEffect, useState } from "react";
import { FormList } from "./formList";
import { OptionsOutletContextType, IOptions, IIdentity } from "@/interfaces";
import { BaseKey, HttpError, useGetIdentity, useGo, useNavigation, useResource } from "@refinedev/core";
import dayjs from "dayjs";
import { useBlocker, useOutletContext } from "react-router-dom";
interface SubmitButtonProps {
  form: FormInstance;
}

export const OnboardPage = () => {
  const { data: identity } = useGetIdentity<IIdentity>();
  const { show } = useNavigation();
  const [ submitted, setSubmitted ] = useState(false);
  const { resource } = useResource();
  // console.log('oboard', resource)
  // const blocker = useBlocker(({ currentLocation, nextLocation }) =>
  //   !submitted &&
  //   currentLocation.pathname !== nextLocation.pathname
  // )

  const { 
    current, gotoStep, 
    stepsProps, formProps, 
    form, onFinish, 
    saveButtonProps, formLoading
   } =
    useStepsForm<IOptions, HttpError, IOptions>(
      {
        action: "create",
        resource: "options",
        submit: async (values) => {
          try {
                // if (values.hasOwnProperty('fiscal_year_start') ) values.fiscal_year_start = values.fiscal_year_start.format('YYYY/MM/DD').toString();
                // console.log(values, optionsValues);
                const data = {...values} as any;
                if (data.hasOwnProperty('fiscal_year_start') ) data.fiscal_year_start = data.fiscal_year_start.format('YYYY/MM/DD').toString();
                if ( data.logo_file?.length ) data.logo_file = data.logo_file[0].originFileObj;
                const formData = new FormData();
                const keys = Object.keys(data);
            
                keys.forEach( key => {
                  console.log(key, data[key]);
                  if ( Array.isArray(data[key]) ) {
                    data[key].map( per => {
                          formData.append(`${key}[]`, per);
                      })
                  } else {
                      formData.append(key, data[key])
                  }
                
                });
                const response = await onFinish(formData as any);
                console.log('response', response)
                setSubmitted(true);
                show("options", identity?.options.id as BaseKey);
              } catch (error) {
                console.log(error);
              }
        },
      }
    );

    return (
      <Create
      isLoading={formLoading}
      footerButtons={
        <>
          {current > 0 && (
            <Button
              onClick={() => {
                gotoStep(current - 1);
              }}
            >
              Previous
            </Button>
          )}
          {current < FormList.length - 1 && (
            <Button
              onClick={() => {
                gotoStep(current + 1);
              }}
            >
              Next
            </Button>
          )}
          {current === FormList.length - 1 && (
            <SaveButton {...saveButtonProps} />
          )}
        </>
      }
    >
      <Steps {...stepsProps}>
        <Steps.Step title="About Post" />
        <Steps.Step title="Content" />
        <Steps.Step title="Contents" />
      </Steps>

      <Form 
        {...formProps}
        layout="vertical"
        style={{ marginTop: 30 }}
        form={form}
      >
        {FormList[current]}
      </Form>
    </Create>
    )
}