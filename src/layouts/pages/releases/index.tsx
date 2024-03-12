
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Autocomplete from "@mui/material/Autocomplete";

import ReleaseForm from "./components/ReleaseForm";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';


// Data
import dataTableData from "layouts/applications/data-tables/data/dataTableData";
import { useState } from "react";

function Releases(): JSX.Element {
  const [client, setClient] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [openForm, setOpenForm] = useState<boolean>(false);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" alignItems="center" justifyContent="space-between" pt={2}>
        <MDBox display="flex">
          <Autocomplete
            disableClearable
            value={client}
            options={["Client", "Test"]}
            onChange={(event, newValue) => {
              setClient(newValue);
            }}
            size="small"
            sx={{ width: "5rem" }}
            renderInput={(params) => <MDInput {...params} />}
          />
          <MDBox pl={2}>
            <Autocomplete
              disableClearable
              value={client}
              options={["Release Type", "Test"]}
              onChange={(event, newValue) => {
                setClient(newValue);
              }}
              size="small"
              sx={{ width: "7.6rem" }}
              renderInput={(params) => <MDInput {...params} />}
            />
          </MDBox>
        </MDBox>
        <MDButton
          variant="contained"
          color="primary"
          size="small"
          onClick={() => setOpenForm(true)}
        >
          Add PR< AddCircleOutlineRoundedIcon sx={{ml: 0.5}}/>
        </MDButton>
      </MDBox>
      <MDBox pt={2}>
        <MDTypography fontWeight="bold" fontSize="20px">
          Manage Press Release
        </MDTypography>
      </MDBox>
      <MDBox pt={openForm ? 6 : 2} pb={3}>
        <Card>
          {!openForm ? (
            <DataTable table={dataTableData} />
          ) : (
            <ReleaseForm onClose={() => setOpenForm(false)} />
          )}
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Releases;
