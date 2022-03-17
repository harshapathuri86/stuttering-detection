import React, { Component } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Context from "@mui/base/TabsUnstyled/TabsContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

//     </Grid>
//   </form>;
// };

export default function UserDetails({
  nextStep,
  prevStep,
  handleChange,
  values,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState,
    clearErrors,
    getValues,
    setError,
  } = useForm({
    mode: "onChange",
  });

  // const validateCaseName = (value) => {
  //   if (value.length < 3) {
  //     setError("case_name", "required", "Case name is required");
  //     return false;
  //   }
  //   setError("case_name", "required", "");
  //   return true;
  // };

  // const validateCaseNumber = (value) => {
  //   if (isNaN(value)) {
  //     setError("casenumber", "required", "Case number is required");
  //     return false;
  //   }
  //   setError("casenumber", "required", "");
  //   return true;
  // };

  const onSubmit = (data) => {
    console.log("submit data", data);
    nextStep();
  };

  return (
    <form>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            required
            id="case_name"
            name="case_name"
            label="Case Name"
            fullWidth
            autoCapitalize="true"
            autoComplete="case_name"
            {...register("case_name", {
              required: true,
              onChange: handleChange("case_name"),
              value: values.case_name,
            })}
            helperText={formState.errors.case_name?.message}
            error={formState.errors.case_name?.message ? true : false}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            type="number"
            id="case_number"
            name="case_number"
            label="Case Number"
            fullWidth
            autoComplete="case_number"
            {...register("case_number", {
              required: true,
              onChange: handleChange("case_number"),
              validate: {
                isPositive: (number) => number > 0 || "Must be positive",
              },
              value: values.case_number,
            })}
            helperText={formState.errors.case_number?.message}
            error={formState.errors.case_number?.message ? true : false}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            required
            id="age"
            name="age"
            label="Age"
            fullWidth
            autoComplete="age"
            {...register("age", {
              required: true,
              onChange: handleChange("age"),
              validate: {
                isPositive: (number) => number > 0 || "Must be positive",
              },
              value: values.age,
            })}
            helperText={formState.errors.age?.message}
            error={formState.errors.age?.message ? true : false}
          />
        </Grid>
        <Grid item xs={6}>
          {/* contact number */}
          <TextField
            required
            id="contact_number"
            name="contact_number"
            label="Contact Number"
            fullWidth
            autoComplete="contact_number"
            {...register("contact_number", {
              required: true,
              onChange: handleChange("contact_number"),
              validate: {
                isContactNumber: (number) =>
                  number.length === 10 || "Must be 10 digits",
              },
              value: values.contact_number,
            })}
            helperText={formState.errors.contact_number?.message}
            error={formState.errors.contact_number?.message ? true : false}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="email"
            name="email"
            label="Email"
            fullWidth
            autoComplete="email"
            {...register("email", {
              required: true,
              onChange: handleChange("email"),
              validate: {
                isEmail: (email) =>
                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) ||
                  "Invalid email address",
              },
              value: values.email,
            })}
            helperText={formState.errors.email?.message}
            error={formState.errors.email?.message ? true : false}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="place"
            name="place"
            label="Place"
            fullWidth
            autoComplete="place"
            {...register("place", {
              required: true,
              onChange: handleChange("place"),
              value: values.place,
            })}
            helperText={formState.errors.place?.message}
            error={formState.errors.place?.message ? true : false}
          />
        </Grid>
        <Grid item xs={6}>
          <Select
            variant="outlined"
            fullWidth
            id="role"
            label="Role"
            defaultValue={""}
            value={values.martial_status}
            {...register("martial_status", {
              required: true,
              validate: {
                notEmpty: (value) => value !== "" || "Please select",
              },
              onChange: handleChange("martial_status"),
              value: values.martial_status,
            })}
            error={formState.errors.martial_status?.message ? true : false}
            helperText={formState.errors.martial_status?.message}
          >
            <MenuItem value=""> </MenuItem>
            <MenuItem value={"single"}>Single</MenuItem>
            <MenuItem value={"married"}>Married</MenuItem>
            <MenuItem value={"divorced"}>Divorced</MenuItem>
            <MenuItem value={"widowed"}>Widowed</MenuItem>
            <MenuItem value={"preffered not to say"}>
              Prefered not to say
            </MenuItem>
          </Select>
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="occupation"
            name="occupation"
            label="Occupation"
            fullWidth
            autoComplete="occupation"
            {...register("occupation", {
              required: true,
              onChange: handleChange("occupation"),
              value: values.occupation,
            })}
            helperText={formState.errors.occupation?.message}
            error={formState.errors.occupation?.message ? true : false}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="education"
            name="education"
            label="Education"
            fullWidth
            autoComplete="education"
            {...register("education", {
              required: true,
              onChange: handleChange("education"),
              value: values.education,
            })}
            helperText={formState.errors.education?.message}
            error={formState.errors.education?.message ? true : false}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="address"
            name="address"
            label="Address"
            fullWidth
            autoComplete="address"
            {...register("address", {
              required: true,
              onChange: handleChange("address"),
              value: values.address,
            })}
            helperText={formState.errors.address?.message}
            error={formState.errors.address?.message ? true : false}
          />
        </Grid>
        <Grid item xs={6}>
          <Select
            variant="outlined"
            fullWidth
            id="role"
            label="Role"
            defaultValue={""}
            value={values.duration}
            {...register("duration", {
              required: true,
              validate: {
                notEmpty: (value) => value !== "" || "Please select duration",
              },
              onChange: handleChange("duration"),
              value: values.duration,
            })}
            helperText={formState.errors.duration?.message}
            error={formState.errors.role ? true : false}
          >
            <MenuItem value=""> </MenuItem>
            <MenuItem value={0}>Less than 1 Month</MenuItem>
            <MenuItem value={1}>1 Month</MenuItem>
            <MenuItem value={2}>2 Months</MenuItem>
            <MenuItem value={3}>3 Months</MenuItem>
            <MenuItem value={4}>4 Months</MenuItem>
            <MenuItem value={5}>5 Months</MenuItem>
            <MenuItem value={6}>More than 6 Months</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="nature"
            name="nature"
            label="Nature of the problem"
            fullWidth
            autoComplete="nature"
            {...register("nature", {
              required: true,
              onChange: handleChange("nature"),
              value: values.nature,
            })}
            helperText={formState.errors.nature?.message}
            error={formState.errors.nature?.message ? true : false}
          />
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
          >
            Continue
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
