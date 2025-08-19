import { CSSProperties, ReactNode } from "react";
import Button from "@mui/material/Button";

interface IButtonProps {
  buttonVarient: "text" | "outlined" | "contained";
  name: ReactNode;
  endIcon?: ReactNode;
  startIcon?: ReactNode;
  buttonClick?: () => void;
  isDisable?: boolean;
  buttonColor?: string;
  buttonBgColor?: string;
  style?: CSSProperties;
  dataTestid?: string;
}

/*
 * purpose: Reusable Button Component (simplified)
 * author: Ganesh Mesta
 * lastUpdatedBy: Vivek Hegde
 * version: 1.2
 * lastUpdatedAt: 19-08-2025
 */

export const PmsButton = (props: IButtonProps) => {
  return (
    <Button
      variant={props.buttonVarient}
      endIcon={props.endIcon}
      startIcon={props.startIcon}
      onClick={props.buttonClick}
      disabled={props.isDisable}
      data-testid={props.dataTestid ?? "pms-button"}
      sx={{
        fontSize: "12px",
        fontWeight: 500,
        textTransform: "none",
        borderRadius: "4px",
        lineHeight: 1.5,
        fontFamily: "Poppins",
        textAlign: "left",
        px: 3.5,
        py: 1.25,
        justifyContent: "left",
        backgroundColor: props.isDisable
          ? "#999"
          : props.buttonBgColor ??
            (props.buttonVarient === "contained" ? "#002979" : "transparent"),
        color: props.isDisable
          ? "#fff"
          : props.buttonColor ??
            (props.buttonVarient === "contained" ? "#fff" : "#002979"),
        borderColor:
          props.buttonVarient === "outlined" ? "#1976d2" : "transparent",
        "&:hover": {
          backgroundColor: props.isDisable
            ? "#999"
            : props.buttonBgColor ??
              (props.buttonVarient === "contained" ? "#002979" : "#f5f5f5"),
          borderColor:
            props.buttonVarient === "outlined" ? "#1565c0" : "transparent",
        },
        ...props.style,
      }}
    >
      {props.name}
    </Button>
  );
};
