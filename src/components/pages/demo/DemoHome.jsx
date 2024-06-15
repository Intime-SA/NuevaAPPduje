import React from "react";
import { Link } from "react-router-dom";
import { Button, Slide, Tooltip, useMediaQuery } from "@mui/material";
import { createTheme, useTheme } from "@mui/material/styles";
const DemoHome = () => {
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 800, // Define md como 800px
        lg: 1200,
        xl: 1536,
      },
    },
  });
  const isMiddleMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [drawerWidth, setDrawerWidth] = React.useState(
    isMiddleMobile ? 75 : 240
  );
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div
      style={{
        width: "100%",
        marginTop: isMobile ? "1rem" : "10rem",
        display: "flex",

        alignItems: isMobile ? "center" : "flex-start",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: isMobile ? "center" : "space-around",
          alignItems: isMobile ? "center" : "flex-start",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div style={{ width: isMobile ? "60%" : "30%", marginLeft: "7rem" }}>
          <Link to="/shop">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/Niche%20service%20marketplace-pana.svg?alt=media&token=b379c721-1ee4-49c4-b5da-3cdfa1fbe5e0"
              alt=""
              style={{
                width: "100%",
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </Link>
        </div>
        <div style={{ width: isMobile ? "60%" : "30%" }}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/Contact%20us-pana.svg?alt=media&token=2c149d4a-f339-42d1-a2bc-413e29ea0917"
            alt=""
            style={{
              width: "100%",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>
      </div>
    </div>
  );
};

export default DemoHome;
