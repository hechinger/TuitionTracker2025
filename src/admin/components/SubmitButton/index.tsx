import Fab from "@mui/material/Fab";
import Container from "@mui/material/Container";
import PublishIcon from "@mui/icons-material/Publish";
import CheckIcon from "@mui/icons-material/Check";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import styles from "./styles.module.scss";

export type SubmittingState = {
  state: string;
  error?: string;
};

const icons = {
  ready: <PublishIcon />,
  submitting: <CircularProgress />,
  success: <CheckIcon />,
  error: <PriorityHighIcon />,
} as Record<string, React.ReactNode>;

const colors = {
  ready: "primary",
  submitting: "primary",
  success: "success",
  error: "error",
} as Record<string, "primary" | "success" | "error">;

export default function SubmitButton(props: {
  submittingState: SubmittingState;
  submitChanges: () => void;
  disabled?: boolean;
}) {
  const {
    submittingState,
    submitChanges,
    disabled = false,
  } = props;

  return (
    <>
      <div className={styles.fab}>
        <Fab
          color={colors[submittingState.state]}
          aria-label="submit"
          onClick={submitChanges}
          disabled={disabled || submittingState.state !== "ready"}
        >
          {icons[submittingState.state]}
        </Fab>
      </div>

      {submittingState.error && (
        <div className={styles.error}>
          <Container maxWidth="sm">
            <Alert severity="error" variant="filled">
              {submittingState.error}
            </Alert>
          </Container>
        </div>
      )}
    </>
  );
}
