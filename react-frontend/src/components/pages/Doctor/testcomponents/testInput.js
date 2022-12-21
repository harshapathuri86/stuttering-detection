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

export default function TestCountInput({
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
            type="number"
            id="questions_count"
            name="questions_count"
            label="Number of Questions"
            fullWidth
            {...register("questions_count", {
              required: true,
              onChange: handleChange("questions_count"),
              validate: {
                isPositive: (number) => number > 0 || "Must be positive",
              },
              value: values.questions_count,
            })}
            helperText={formState.errors.questions_count?.message}
            error={formState.errors.questions_count?.message ? true : false}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            type="number"
            id="passage_count"
            name="passage_count"
            label="Number of Passages"
            fullWidth
            {...register("passage_count", {
              required: true,
              onChange: handleChange("passage_count"),
              validate: {
                isPositive: (number) => number > 0 || "Must be positive",
              },
              value: values.passage_count,
            })}
            helperText={formState.errors.passage_count?.message}
            error={formState.errors.passage_count?.message ? true : false}
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
