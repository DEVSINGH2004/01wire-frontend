// @mui material components
import Card from "@mui/material/Card";
import { TableCell, IconButton } from '@mui/material';
import { DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material';



// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Autocomplete from "@mui/material/Autocomplete";

import ClientForm from "./components/ClientForm";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import productImage from "assets/images/products/product-11.jpg";


import {
  GET_CLIENTS,
  IGetClientsVars,
  IGetClients,
} from "graphql/queries/filterClientsPaginated";

// Data
import { useState } from "react";

const dataTableData = {
  columns: [
    {
      Header: "name", accessor: "name", width: "20%", Cell: ({ row }: any) => {
      
        return (
        <MDBox display="flex" alignItems="center">
            <MDBox
              mr={1}
        component="img"
        src={productImage}
        alt="Product Image"
        borderRadius="lg"
        shadow="sm"
        width="127px"
        height="53px"
        position="relative"
            />
            <MDTypography>{row.values.name}</MDTypography>
            </MDBox>
              
      );
    }},
    { Header: "", accessor: "dal", width: "100px", Cell: () => {
      return (
            <IconButton
              onClick={e => {
                e.stopPropagation();
              }}
              size="large"
            >
              <DeleteOutlineIcon />
            </IconButton>
      );
    }},
  ],

 

  rows: [
    {
      name: "Pietro Hoggins",
      position: "Account Coordinator",
      office: "Lexington",
      age: 34,
      startDate: "7/1/2021",
      salary: "$245,579",
    },
    {
      name: "Cobb Fish",
      position: "VP Product Management",
      office: "General Elizardo Aquino",
      age: 60,
      startDate: "8/27/2020",
      salary: "$201,191",
    },
    {
      name: "Goddart Zorzutti",
      position: "Office Assistant I",
      office: "Hedi",
      age: 44,
      startDate: "4/14/2021",
      salary: "$89,168",
    },
    {
      name: "Joyce Gason",
      position: "VP Product Management",
      office: "Jingzhou",
      age: 48,
      startDate: "10/10/2020",
      salary: "$285,350",
    },
    {
      name: "Juliet Lemm",
      position: "Junior Executive",
      office: "Tečovice",
      age: 37,
      startDate: "4/28/2021",
      salary: "$479,963",
    },
    {
      name: "Filberte Dobrowolski",
      position: "Senior Cost Accountant",
      office: "Puncakmanis",
      age: 55,
      startDate: "8/21/2020",
      salary: "$424,438",
    },
    {
      name: "Justinian Faraday",
      position: "Help Desk Technician",
      office: "Bacong",
      age: 60,
      startDate: "1/24/2021",
      salary: "$369,012",
    },
    {
      name: "Amata Cahan",
      position: "Technical Writer",
      office: "Hradec Králové",
      age: 56,
      startDate: "9/22/2020",
      salary: "$385,712",
    },
    {
      name: "Gunar Albrecht",
      position: "Tax Accountant",
      office: "Chernivtsi",
      age: 52,
      startDate: "6/30/2021",
      salary: "$392,642",
    },
   
    {
      name: "Cassandre Watters",
      position: "Technical Writer",
      office: "Karang Tengah",
      age: 21,
      startDate: "7/31/2021",
      salary: "$213,508",
    },
    {
      name: "Cobb Fish",
      position: "VP Product Management",
      office: "General Elizardo Aquino",
      age: 60,
      startDate: "8/27/2020",
      salary: "$201,191",
    },
  ],
};


function Releases(): JSX.Element {
  const [client, setClient] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [openForm, setOpenForm] = useState<boolean>(false);

  const { data: clientsData } = useQuery<IGetClients, IGetClientsVars>(
    GET_CLIENTS,
    {
      variables: {
        filterInput: {
        },
        paginationInput: {
          currentPage: 0,
          perPage: 200,
        },
      },
    }
  );

  console.log("clientsData", clientsData)

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" alignItems="center" justifyContent="flex-end" pt={2}>
       
        <MDButton
          variant="contained"
          color="primary"
          size="small"
          onClick={() => setOpenForm(true)}
        >
          Add New Client < AddCircleOutlineRoundedIcon sx={{ml: 0.5}}/>
        </MDButton>
      </MDBox>
      <MDBox pt={openForm ? 6 : 2} pb={3}>
        <Card>
          {!openForm ? (
            <DataTable showHeader={false}table={dataTableData} />
          ) : (
            <ClientForm onClose={() => setOpenForm(false)} />
          )}
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Releases;
