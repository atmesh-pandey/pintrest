const axios = require("axios");
const FormData = require("form-data");

const uploadImage = async (imageData) => {
  try {
    /* remove appended data:image/png;base64, in binary */
    imageData = imageData.slice(imageData.indexOf("base64,") + 7);

    const formData = new FormData();
    formData.append("image", imageData);

    const imgbb_key = "d4e137a82747189e040b0443065a0e44";
    const imgbb_url = `https://api.imgbb.com/1/upload?key=${imgbb_key}`;

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: imgbb_url,
      headers: {
        ...formData.getHeaders(),
      },
      data: formData,
    };

    const response = await axios.request(config);
    console.log("Image file successfully uploaded. ✅ URL:", response?.data?.data?.url);

    return response?.data;
  } catch (e) {
    console.error("Error occurred in uploadImage service:", e);
    return { success: false, error: e.message };
  }
};

const uploadImageFile = async (imageData) => {
  try {
    const formData = new FormData();
    formData.append("image", imageData.buffer, {
      filename: imageData.originalname,
      contentType: imageData.mimetype,
    });

    const imgbb_key = "d4e137a82747189e040b0443065a0e44";
    const imgbb_url = `https://api.imgbb.com/1/upload?key=${imgbb_key}`;

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: imgbb_url,
      headers: {
        ...formData.getHeaders(),
      },
      data: formData,
    };

    const response = await axios.request(config);
    console.log("Image file successfully uploaded. ✅ URL:", response?.data?.data?.url);

    return response?.data;
  } catch (e) {
    console.error("Error occurred in uploadImage service:", e);
    return { success: false, error: e.message };
  }
};

// Exporting the functions
module.exports = {
  uploadImage,
  uploadImageFile,
};
