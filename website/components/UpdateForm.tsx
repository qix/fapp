import { Formik, Form } from "formik";
import { InferType } from "yup";
import { remotePerformAction } from "../frontend/performAction";
import React, { useState } from "react";
import { TypedSchema } from "yup/lib/util/types";
import { Action } from "../models/Action";

export function CreateForm<DbObject, T extends TypedSchema, A extends Action>({
  schema,
  initialValues,
  action,
  buildActionPayload,
  children,
}: {
  schema: T;
  initialValues: InferType<T>;
  action: A["type"];
  buildActionPayload: (payload: InferType<T>) => A["payload"];
  children: JSX.Element;
}) {
  type FormFields = InferType<T>;
  const [status, setStatus] = useState<JSX.Element>();

  const sendUpdate = (payload: FormFields) => {
    setStatus(
      <>
        <div
          className="spinner-border text-primary spinner-border-sm"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>{" "}
        <span className="text-secondary">Updating...</span>
      </>
    );
    return remotePerformAction({
      type: action,
      payload: buildActionPayload(payload),
    } as Action).then(
      (data) => {
        if (data.error) {
          setStatus(
            <span className="text-danger">
              <strong>Failed to update:</strong> {data.error}
            </span>
          );
        } else {
          setStatus(
            <span className="text-success">
              <strong>Okay!</strong>
            </span>
          );
        }
      },
      (err) => {
        setStatus(
          <span className="text-danger">
            <strong>Failed to update:</strong> {err.toString()}
          </span>
        );
      }
    );
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          sendUpdate(values).finally(() => {
            setSubmitting(false);
          });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {children}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Submit
            </button>
            {status ? <div className="py-3">{status}</div> : null}
          </Form>
        )}
      </Formik>
    </>
  );
}
