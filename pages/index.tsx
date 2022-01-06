import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.scss";

const Home = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  const fileUpload = useRef<HTMLInputElement | null>(null);
  const textarea = useRef<HTMLTextAreaElement | null>(null);

  const handleFileProcessing = async (files: FileList) => {
    if (images.length >= 6) {
      alert("Max number of images to process is 6!");
      return;
    }
    if (!files) return;

    const newImages = await Promise.all(
      Array.from(files)
        .filter((item) => item.type.startsWith("image"))
        .map(async (item) => {
          const stream = item.stream();
          const response = new Response(stream);
          const blob = await response.blob();

          return URL.createObjectURL(blob);
        })
    );

    setImages((prev) => prev.concat(newImages));
  };

  const handlePaste = async (event: ClipboardEvent) => {
    if (!(document.activeElement === textarea.current && textarea.current.contains(event.target))) {
      return;
    }
    const items: FileList = event.clipboardData.files;
    if (!items) return;

    handleFileProcessing(items);
  };

  const handleFileUpload = (event) => {
    const files: FileList = event.target.files;
    handleFileProcessing(files);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleImageRemove = (removeIndex: number) => {
    const newImages = images.filter((_, index) => index !== removeIndex);
    setImages(newImages);
  };

  useEffect(() => {
    window.document.addEventListener("paste", handlePaste);

    return () => window.document.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <main className={style.main}>
      <h1>Share You Ideas</h1>
      <div className={style.container}>
        <textarea
          placeholder="Share your ideas here..."
          value={content}
          cols={60}
          ref={textarea}
          rows={10}
          onChange={(event) => handleChange(event)}
        />

        <ul className={style.list}>
          {images.map((image, index) => (
            <li className={style.item} key={index}>
              <img src={image} alt="" />
              <button className={style["item-close"]} onClick={() => handleImageRemove(index)}>
                <svg viewBox="0 0 17 17" fill="currentColor">
                  <path d="M9.565 8.595l5.829 5.829a.686.686 0 01-.97.97l-5.83-5.83-5.828 5.83a.686.686 0 01-.97-.97l5.829-5.83-5.83-5.828a.686.686 0 11.97-.97l5.83 5.829 5.829-5.83a.686.686 0 01.97.97l-5.83 5.83z" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        <div className={style.function}>
          <button className={style["function-image-upload"]} onClick={() => fileUpload.current.click()}>
            <svg viewBox="0 0 22 20" fill="currentColor">
              <path d="M3 5.5a1 1 0 00-1 1v10a1 1 0 001 1h13a1 1 0 001-1v-10a1 1 0 00-1-1H3zm0-2h13a3 3 0 013 3v10a3 3 0 01-3 3H3a3 3 0 01-3-3v-10a3 3 0 013-3zm1.5 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm.488 6.155c.203-1.296.656-1.976 1.337-2.21.276-.094.609.009 1.55.495 1.57.811 2.416 1.025 3.567.457 1.115-.55 1.568-1.39 1.837-2.754l.064-.339c.13-.703.216-.954.35-1.083.341-.328.583-.359.989-.127a1 1 0 10.991-1.737 2.665 2.665 0 00-3.366.422c-.549.528-.723 1.039-.93 2.16l-.06.317c-.16.812-.336 1.138-.76 1.347-.368.182-.743.087-1.765-.44-1.446-.747-2.113-.953-3.117-.609-1.474.506-2.355 1.827-2.663 3.79a1 1 0 101.976.311zM6 2.5a1 1 0 110-2h12a4 4 0 014 4v9a1 1 0 01-2 0v-9a2 2 0 00-2-2H6z" />
            </svg>
            Image
          </button>
          <input
            className={style["file-upload"]}
            onChange={handleFileUpload}
            type="file"
            accept="image/*"
            ref={fileUpload}
          />
        </div>
        <p className={style.tips}>You can paste or upload to images in textarea ✌️</p>
      </div>
    </main>
  );
};

export default Home;
