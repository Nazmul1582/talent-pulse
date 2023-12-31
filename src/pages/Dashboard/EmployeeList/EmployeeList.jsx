import { Button, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import useUser from "../../../hooks/useUser";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { NavLink } from "react-router-dom";
import axiosPublic from "../../../utils/AxiosPublic";

const EmployeeList = () => {
  const [users, refetch] = useUser();
  const axiosSecure = useAxiosSecure();
  const columns = [
    { field: "name", headerName: "Name", width: 130 },
    { field: "email", headerName: "Email", width: 180 },
    {
      field: "isVerified",
      headerName: "Is Verified",
      width: 80,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleVerify(params.row.id)}
          aria-label="delete"
        >
          {params.row.isVerified ? <CheckIcon /> : <CloseIcon />}
        </IconButton>
      ),
    },
    { field: "bank_account_no", headerName: "Bank Account", width: 130 },
    { field: "salary", headerName: "Salary", width: 80 },
    {
      field: "pay",
      headerName: "Pay",
      width: 80,
      renderCell: (params) => (
        <Button
          disabled={params.row.isVerified ? false : true}
          variant="contained"
          onClick={() => handlePay(params.row.email)}
        >
          Pay
        </Button>
      ),
    },
    {
      field: "details",
      headerName: "Details",
      width: 130,
      renderCell: (params) => (
        <NavLink to={`/dashboard/employee/${params.row.email}`}>
          <Button variant="outlined">Details</Button>
        </NavLink>
      ),
    },
  ];

  const handleVerify = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to verify this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, verify user!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const isVerifiedUser = { isVerified: true };
          const res = await axiosSecure.patch(`/users/${id}`, isVerifiedUser);
          if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire({
              title: "Verified!",
              text: "Your user has been verified.",
              icon: "success",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Oops!",
            text: error.message,
            icon: "error",
          });
        }
      }
    });
  };

  const handlePay = async (email) => {
    const res = await axiosPublic.get(`/users/${email}`);

    const { value: formValues } = await Swal.fire({
      title: "Enter Salary Information",
      html: `
        <label for="salary">Salary</label>
        <input type="number" id="salary" class="swal2-input" value=${res.data.salary}>
        <label for="month">Month</label>
        <input type="text" id="month" class="swal2-input" placeholder="Enter month">
        <label for="year">Year</label>
        <input type="number" id="year" class="swal2-input" placeholder="Enter year">        
      `,
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "confirm",
      preConfirm: () => {
        const salary = document.getElementById("salary").value;
        const month = document.getElementById("month").value;
        const year = document.getElementById("year").value;
        const transactionId = `tid-${Date.now()}`;
        const payDetails = {
          name: res.data.name,
          email: res.data.email,
          image: res.data.image,
          designation: res.data.designation,
          salary,
          month,
          year,
          transactionId,
        };
        return payDetails;
      },
    });
    if (formValues) {
      formValues.salary = parseInt(formValues.salary);
      formValues.year = parseInt(formValues.year);
      if (!formValues.salary || !formValues.month || !formValues.year) {
        return Swal.fire(
          "Warning!",
          "You have to fill up the form!",
          "warning"
        );
      }
      try {
        const res = await axiosSecure.post(
          `/users/employee/pay-salary`,
          formValues
        );
        if (res.data._id) {
          Swal.fire({
            title: "You have paid the salary!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire("Oops!", error.message, "error");
      }
    }
  };

  const rows = users
    .filter((user) => user.userRole !== "admin" && user.userRole !== "hr")
    .map((ele) => {
      return {
        id: ele._id,
        name: ele.name,
        email: ele.email,
        isVerified: ele.isVerified,
        bank_account_no: ele.bank_account_no,
        salary: ele.salary,
      };
    });
  return (
    <>
      <Typography
        textAlign="center"
        component="h2"
        variant="h4"
        fontWeight={600}
        mb={4}
      >
        Employee List
      </Typography>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </div>
    </>
  );
};

export default EmployeeList;
