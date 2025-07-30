import { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

export default function FieldGroup(props: {
  title: string;
  presentation?: string;
  children: React.ReactNode;
}) {
  const {
    title,
    presentation,
    children
  } = props;

  const [isOpen, setIsOpen] = useState(presentation !== "collapsed");

  return (
    <Paper
      sx={{ p: 4 }}
      elevation={1}
    >
      <Stack direction="row" spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
        </Box>
        <Box>
          <IconButton
            size="small"
            aria-label={isOpen ? "Collapse" : "Expand"}
            onClick={() => setIsOpen((old) => !old)}
          >
            <UnfoldMoreIcon />
          </IconButton>
        </Box>
      </Stack>
      {isOpen && children}
    </Paper>
  );
}
