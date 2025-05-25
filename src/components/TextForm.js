import React, { useState } from "react";
import axios from "axios";

export default function TextForm(props) {
  // const [text, setText] = useState('Enter text here');
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
    const [previewText, setPreviewText] = useState(""); // preview output
  const handleUpClick = () => {
    console.log("Uppercase was clicked");
    let newText = text.toUpperCase();
    setPreviewText(newText);
    props.showAlert("Converted to uppercase!", "success");
  };
  const handleLowClick = () => {
    console.log("Lowercase was clicked");
    let newText = text.toLowerCase();
    setPreviewText(newText);
    props.showAlert("Converted to lowercase!", "success");
  };
  const handleClearClick = () => {
    console.log("Clear text was clicked");
    setText("");
   setPreviewText("");
    props.showAlert("Text cleared!", "success");
  };
  const handleOnChange = (event) => {
    console.log("On change");
    setText(event.target.value);
  };
  const handleCapitalize = () => {
    let newText = text
      .split(" ")
      .map((el) => el.charAt(0).toUpperCase() + el.slice(1))
      .join(" ");
    setPreviewText(newText);
    props.showAlert("Capitalized first character of each word!", "success");
  };

  const handleCopy = () => {
    console.log("Text copied.");
    // 1st way
    // var text = document.getElementById("myBox");
    // text.select();
    // navigator.clipboard.writeText(text.value);
    // document.getSelection().removeAllRanges();
    // props.showAlert("Copied to Clipboard!", "success");

    // 2nd way
    navigator.clipboard.writeText(text);
    props.showAlert("Copied to Clipboard!", "success");
  };

  const handleExtraSpaces = () => {
    let newText = text.split(/[ ]+/);
    setPreviewText(newText.join(" "));
    props.showAlert("Removed extra spaces!", "success");
  };

  //  text = "new text"; //Wrong way to change the state
  // setText("new text"); //correct way to change the state
  // ✅ Beautify using Cohere AI
  const beautifyAi = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.cohere.ai/v1/generate",
        {
          model: "command",
          prompt: `Correct grammar and improve this sentence: "${text}"`,
          max_tokens: 100,
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer D6yIm3UkrYAHLKFjRxxYEohtDxy8IFgHud04DXse`,
            "Content-Type": "application/json",
          },
        }
      );

      const beautified = response.data.generations[0].text.trim();
      setPreviewText(beautified);// update original text
      props.showAlert("Text beautified using AI!", "success");
    } catch (error) {
      console.error("Beautify failed:", error);
      alert("Something went wrong. Check your API key or quota.");
    }
    setLoading(false);
  };
  return (
    <>
      <div
        className="container"
        style={{ color: props.mode === "dark" ? "white" : "black" }}
      >
        <h2 className="mb-4">{props.heading} </h2>
        <div className="mb-3">
          <textarea
            className="form-control"
            value={text}
            id="myBox"
            onChange={handleOnChange}
            style={{
              backgroundColor: props.mode === "dark" ? "#13466e" : "white",
              color: props.mode === "dark" ? "white" : "black",
            }}
            rows="8"
          ></textarea>
        </div>
        <button
          disabled={text.length === 0}
          className="btn btn-primary mx-1 my-1"
          onClick={handleUpClick}
        >
          Convert to Uppercase
        </button>
        <button
          disabled={text.length === 0}
          className="btn btn-primary mx-1 my-1"
          onClick={handleLowClick}
        >
          Convert to Lowercase
        </button>
        <button
          disabled={text.length === 0}
          className="btn btn-primary mx-1 my-1"
          onClick={handleClearClick}
        >
          Clear Text
        </button>
        <button
          disabled={text.length === 0}
          className="btn btn-primary mx-1 my-1"
          onClick={handleCapitalize}
        >
          Capitalize Text
        </button>
        <button
          disabled={text.length === 0}
          className="btn btn-primary mx-1 my-1"
          onClick={handleCopy}
        >
          Copy Text
        </button>
        <button
          disabled={text.length === 0}
          className="btn btn-primary mx-1 my-1"
          onClick={handleExtraSpaces}
        >
          Remove Extra Spaces
        </button>
        <button
          disabled={text.length === 0 || loading}
          className="btn btn-primary mx-1 my-1"
          onClick={beautifyAi}
        >
          {loading ? "Beautifying..." : "Beautify with AI"}
        </button>
      </div>
      <div
        className="container my-3"
        style={{ color: props.mode === "dark" ? "white" : "black" }}
      >
        <h2>Your Text Summary</h2>
        <p>
          {
            text.split(/\s+/).filter((element) => {
              return element.length !== 0;
            }).length
          }{" "}
          words and {text.length} characters
        </p>
        <p>
          t=
          {0.008 *
            text.split(/\s+/).filter((element) => {
              return element.length !== 0;
            }).length}{" "}
          seconds to read
        </p>
       <h2>Preview</h2>
        <div
          className="form-control"
          style={{
            minHeight: "150px",
            backgroundColor: props.mode === "dark" ? "#13466e" : "#f8f9fa",
            color: props.mode === "dark" ? "white" : "black",
            whiteSpace: "pre-wrap",
          }}
        >
          {previewText.length > 0 ? previewText : "Nothing to preview!"}
        </div>
      </div>
    </>
  );
}
