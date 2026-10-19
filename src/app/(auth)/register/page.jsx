"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const nameSchema = (label) =>
  yup
    .string()
    .trim()
    .required(`${label} is required`)
    .min(4, `${label} must be at least 4 characters`)
    .max(20, `${label} must be at most 20 characters`);

const schema = yup.object({
  firstName: nameSchema("First name"),
  lastName: nameSchema("Last name"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required")
    .integer("Age must be a whole number")
    .min(13, "Age must be at least 13")
    .max(120, "Age must be at most 120"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(12, "Password must be at most 12 characters")
    .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .matches(/[0-9]/, "Password must contain at least 1 number"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^\d+$/, "Phone must contain digits only")
    .min(10, "Phone must be at least 10 digits")
    .max(100, "Phone must be at most 100 digits"),
});

const fields = [
  { name: "firstName", label: "First name", type: "text" },
  { name: "lastName", label: "Last name", type: "text" },
  { name: "age", label: "Age", type: "number" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
  { name: "phone", label: "Phone", type: "text" },
];

export default function RegistrationForm() {
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      age: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const onSubmit = async (data) => {
    setServerMessage("");
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();
      setServerMessage(`User created successfully. ID: ${result.id}`);
      reset();
    } catch (error) {
      setServerMessage(`Error: ${error.message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      style={{ maxWidth: 400, margin: "40px auto", display: "grid", gap: 16 }}
    >
      <h1>Registration</h1>

      {fields.map(({ name, label, type }) => (
        <div key={name} style={{ display: "grid", gap: 4 }}>
          <label htmlFor={name}>{label}</label>
          <input id={name} type={type} {...register(name)} />
          {errors[name] && (
            <span style={{ color: "crimson", fontSize: 13 }}>
              {errors[name].message}
            </span>
          )}
        </div>
      ))}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Register"}
      </button>

      {serverMessage && <p>{serverMessage}</p>}
    </form>
  );
}
