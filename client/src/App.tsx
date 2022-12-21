import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import "./App.css";

async function postImage({
  image,
  description,
}: {
  image: File;
  description: string;
}) {
  const formData = new FormData();

  formData.append("image", image);
  formData.append("description", description);
  const result = await axios.post("http://localhost:8080/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return result;
}

export default function App() {
  const fileRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLImageElement>(null);
  const [images, setImages] = useState<{ name: string }[]>([]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const files = fileRef.current?.files;
      const description = descriptionRef.current?.value.trim();

      const image = files![0];
      const result = await postImage({
        image,
        description: description!,
      });
      handleClear();

      alert(result.data.message);
      setImages((prev) => {
        const newVal = [...prev, { name: result.data.data.name }];
        localStorage.setItem("images", JSON.stringify(newVal));
        return newVal;
      });
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Something Went Wrong");
    }
  }

  function handleClear() {
    fileRef.current!.value = "";
    descriptionRef.current!.value = "";
    previewRef.current!.src = "";
  }

  useEffect(() => {
    if (localStorage.getItem("images")) {
      setImages(JSON.parse(localStorage.getItem("images")!));
    }
  }, []);
  return (
    <div className="main">
      <img ref={previewRef} />
      <form onSubmit={(e) => submit(e)}>
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          required
          onChange={() => {
            previewRef.current!.src = URL.createObjectURL(
              fileRef.current!.files![0]
            );
          }}
        />
        <br />
        <br />

        <input
          type="button"
          value="Clear File Input"
          onClick={() => {
            fileRef.current!.value = "";
            previewRef.current!.src = "";
          }}
        />

        <br />
        <br />
        <input
          type="text"
          ref={descriptionRef}
          placeholder="Description"
          required
        />
        <br />
        <br />
        <input type="submit" value="Submit File" />
      </form>
      <br />
      <br />
      {images.map((image) => (
        <div key={image.name}>
          <a href={"http://localhost:8080/file/" + image.name} target="_blank">
            {image.name}
          </a>{" "}
        </div>
      ))}
    </div>
  );
}
