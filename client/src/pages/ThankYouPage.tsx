import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import Header from "../components/Header";

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ pt: 16, textAlign: "center" }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Thank You!
          </Typography>
          <Typography variant="body1" paragraph>
            Your exam has been submitted successfully.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            You can now close this window or return to your dashboard.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/student/dashboard")}
            sx={{ mt: 2 }}
          >
            Return to Dashboard
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default ThankYouPage;
