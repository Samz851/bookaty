import { Edit, List, SaveButton, useStepsForm } from "@refinedev/antd"
import { Button, Form, FormInstance, Row, Space, Steps } from "antd"
import { useEffect, useState } from "react";
import { FormList } from "./formList";
import { OptionsOutletContextType, IOptions } from "@/interfaces";
import { HttpError, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";
import { useOutletContext } from "react-router-dom";
interface SubmitButtonProps {
  form: FormInstance;
}

export const EditOptions = () => {

  const { 
    current, gotoStep, 
    stepsProps, formProps, 
    form, onFinish, 
    saveButtonProps, setId,
    formLoading
   } =
    useStepsForm<IOptions, HttpError, IOptions>(
      {
        action: "edit",
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
              } catch (error) {
                console.log(error);
              }
        },
      }
    );

    return (
      <Edit
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
    </Edit>
    )
}