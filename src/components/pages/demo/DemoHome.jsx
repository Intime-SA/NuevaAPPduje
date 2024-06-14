import React from "react";
const DemoHome = () => {
  return (
    <div
      style={{
        width: "90%",
        marginTop: "10rem",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <div style={{ width: "20%" }}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/Niche%20service%20marketplace-pana.svg?alt=media&token=b379c721-1ee4-49c4-b5da-3cdfa1fbe5e0"
          alt=""
          style={{
            width: "100%",
            transition: "transform 0.3s ease",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>
      <div style={{ width: "20%" }}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/Contact%20us-pana.svg?alt=media&token=2c149d4a-f339-42d1-a2bc-413e29ea0917"
          alt=""
          style={{
            width: "100%",
            transition: "transform 0.3s ease",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>
    </div>
  );
};

export default DemoHome;
