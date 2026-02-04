import React, { useState } from "react";
import Box from "@mui/material/Box";
import LogoImg from "../../Assets/Images/digiswarnalogow.svg";
import Slide4 from "../../Assets/Images/leftdigi.png";
import "./style.css";

const slides = [
  {
    image: Slide4,
    title: "Manage your bills all at one place",
    description: "",
  },
];

const LeftSide = () => {
  const [selectedSlide, setSelectedSlide] = useState(0);

  const handleSlide = (index) => {
    setSelectedSlide(index);
  };

  return (
    <Box component="div" className={"BBPLPInfo"}>
      <Box component="div" className={"BBPLPIInner"}>
        <Box component="div" className={"BBPLPILogo"}>
          <img src={LogoImg} alt={"BBP"} />
        </Box>
        <Box component="div" className={"BBPLPSlider"}>
          <Box component="div" className={"BBPLPSSlide"}>
            <Box component="div" className={"BBPLPSSImg"}>
              <img src={slides[selectedSlide].image} alt={"BBP"} />
            </Box>
            {slides.length > 1 && (
              <Box component="div" className={"BBPLPSSDots"}>
                {slides.map((slide, index) => (
                  <Box
                    component="div"
                    key={index}
                    className={`${
                      selectedSlide === index ? "BBPLPSSDActive" : ""
                    } BBPLPSSDot`}
                    onClick={() => {
                      handleSlide(index);
                    }}
                  />
                ))}
              </Box>
            )}

            <Box component="div" className={"BBPLPSSTitle"}>
              {slides[selectedSlide].title}
            </Box>
            {slides[selectedSlide].description && (
              <Box component="div" className={"BBPLPSSSubTitle"}>
                {slides[selectedSlide].description}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LeftSide;
