import React, { useState } from "react";
import Exif from "exif-js";
import "./App.css";

function App() {
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = async (event) => {
    setLoading(true);
    const files = Array.from(event.target.files);
    const metadataArray = [];

    for (const file of files) {
      const metadata = await extractMetadata(file);
      metadataArray.push(metadata);
    }

    setImageData(metadataArray);
    setLoading(false);
  };

  const extractMetadata = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          Exif.getData(img, function () {
            const metadata = {
              fileName: file.name,
              width: img.width,
              height: img.height,
              resolution: Exif.getTag(this, "XResolution") || "Unknown",
              colorDepth: img.height ? 24 : "Unknown",
              compression: file.type,
            };
            resolve(metadata);
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="App">
      <h1>Просмотр файлов</h1>
      <div className="file-upload">
        <label htmlFor="fileInput">Выберите файлы</label>
        <input
          id="fileInput"
          type="file"
          multiple
          accept=".jpg, .jpeg, .png, .gif, .tif, .bmp, .pcx"
          onChange={handleFiles}
        />
      </div>
      {loading && <p className="loading">Загрузка...</p>}
      <MetadataTable data={imageData} />
    </div>
  );
}

const MetadataTable = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Dimensions (Width x Height)</th>
          <th>Resolution (DPI)</th>
          <th>Color Depth</th>
          <th>Compression</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.fileName}</td>
            <td>
              {item.width} x {item.height}
            </td>
            <td>{item.resolution}</td>
            <td>{item.colorDepth}</td>
            <td>{item.compression}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default App;
