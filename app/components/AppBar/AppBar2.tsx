"use client";

import React, { useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { auth } from "../../../firebase"; // Firebase Auth をインポート

const AppBar2: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="static"
        sx={{ background: "linear-gradient(30deg, #6a11cb 0%, #2575fc 100%)" }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => router.push("/dashboard")}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            CLASSGU
          </Typography>
          <Box sx={{ width: 48 }} />{" "}
          {/* 空白を入れて戻るボタンと左右対称にする */}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Box
        component="footer"
        sx={{
          background: "linear-gradient(10deg, #303F9F 30%, #039BE5 90%)",
          color: "#fff",
          pt: 3,
          pb: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={5}>
              <Typography variant="h6" gutterBottom>
                ClassGU
              </Typography>
              <Typography variant="body2">
                This is a learning platform for Gifu University students.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3} />
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2">developer@sharettle.com</Typography>
              <Typography variant="body2">090-xxxx-xxxx</Typography>
            </Grid>
          </Grid>
          <Box mt={5} textAlign="center">
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              &copy; {currentYear} ClassGU by Sharettle. Developer R.M.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AppBar2;
