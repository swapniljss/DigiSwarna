import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import UploadImageIcon from "../Icons/UploadImageIcon";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const FileUpload = (props) => {
  const { options, label, required, disabled, onChange, id, readonly, value } =
    props;

  const { imageKey } = options;

  const [mainFile, setMainFile] = useState(value);

  const imageRef = useRef();

  const handleImageUpload = async (event) => {
    var file = event.target.files[0];
    if (!file) return;

    // ❌ invalid file type (.jepg, .gif, etc.)
    // ❌ Reject non-image files (pdf, excel, etc.)
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file");
      event.target.value = "";
      setMainFile("");
      if (imageRef.current) {
        imageRef.current.src = "";
      }
      return;
    }

    setMainFile(file);
    onChange(await toBase64(file));
    var preview = imageRef.current;
    var reader = new FileReader();
    reader.onloadend = function () {
      preview.src = reader.result;
    };
    if (file) {
      setMainFile(file);
      reader.readAsDataURL(file);
    } else {
      setMainFile("");
      preview.src = "";
    }
  };

  return (
    <Box component="div" className={`BBPFileUpload`}>
      <Box component="div" className={`BBPImg`}>
        <Box component="div" className={"BBPIUpload"}>
          <Button
            variant="contained"
            component="label"
            endIcon={<UploadImageIcon fontSize="inherit" />}
            className={`BBPIULabel`}
            disabled={disabled}
          >
            {mainFile || imageKey ? `Change ${label}` : `Upload ${label}`}
            <input
              hidden
              readOnly={readonly}
              required={required}
              id={id}
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
            />
          </Button>
        </Box>
        <Box
          component="div"
          className={"BBPIPreview"}
          style={{ opacity: mainFile || imageKey ? 1 : 0 }}
        >
          {imageKey ? (
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}/image/${imageKey}`}
              alt="Upload"
              ref={imageRef}
            />
          ) : (
            <img src={null} alt="Upload" ref={imageRef} />
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default FileUpload;
