import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import PageLayout from "examples/LayoutContainers/PageLayout";

// Authentication layout components
import Footer from "layouts/authentication/components/Footer";
import NavbarAuthentication from "examples/Navbars/NavbarAuthentication";

function CoverLayout({ image, children }) {
  return (
    <PageLayout>
      <NavbarAuthentication />
      <MDBox
        width="100%"
        height="100vh" // Đảm bảo chiếm hết chiều cao màn hình
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0), // Giảm độ mờ để ảnh nền rõ hơn
              rgba(gradients.dark.state, 0)
            )}, url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh", // Đảm bảo nền chiếm toàn bộ màn hình
        }}
      >
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            {children}
          </Grid>
        </Grid>
      </MDBox>
    </PageLayout>
  );
}

// Typechecking props cho CoverLayout
CoverLayout.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;
