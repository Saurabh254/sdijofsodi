import React, { useEffect, useState } from "react";
import { Student } from "../types";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
} from "@mui/material";
import api_client from "../api_client";
import Header from "../components/Header";
import { RiArrowLeftSLine } from "@remixicon/react";
import { useNavigate } from "react-router-dom";

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api_client.get("/users");
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch students");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Header />

      <Container maxWidth="lg" sx={{ pt: 16, mb: 4 }}>
        <span
          className="mt-8  flex items-center gap-2 cursor-pointer mb-4 "
          onClick={() => navigate("/teacher/dashboard")}
        >
          <RiArrowLeftSLine /> back
        </span>
        <Typography variant="h4" component="h1" gutterBottom>
          Students
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Roll Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Semester</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students &&
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.roll_number}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.branch}</TableCell>
                    <TableCell>{student.semester}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default StudentsPage;
