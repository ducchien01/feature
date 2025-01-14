import { useState } from "react";
import { AvatarCard } from "../../../component/card";
import Layout from "../../layout/layout";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";

const Requests = () => {

    const [selectedEmoji, setSelectedEmoji] = useState<string>("");
    const [darkMode, setDarkMode] = useState(false);
  
    const handleEmojiClick = (emojiData) => {
      setSelectedEmoji(emojiData.unified); // Store the selected emoji
      console.log("Emoji selected:", emojiData);
    };
  
    return (
      <div
        style={{
          background: darkMode ? "#333" : "#fff",
          color: darkMode ? "#fff" : "#000",
          padding: "20px",
          minHeight: "100vh",
        }}
      >
        <h1>Emoji Picker React Example</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>
        
        <div style={{ marginTop: "20px" }}>
          <EmojiPicker
            onEmojiClick={handleEmojiClick} // Custom click handler
            autoFocusSearch={false}
            // theme={darkMode ? "dark" : "light"} // Dark mode support
            emojiStyle={EmojiStyle.FACEBOOK} // Emoji set (Google, Apple, Twitter)
            lazyLoadEmojis={true}
            skinTonesDisabled={false} // Enable skin tone selection
          />
        </div>
  
        {selectedEmoji && (
          <div style={{ marginTop: "20px", fontSize: "2rem" }}>
            Selected Emoji: <span>{String.fromCodePoint(parseInt(selectedEmoji, 16))}</span>
            Selected Emoji: <span>{selectedEmoji}</span>
          </div>
        )}
      </div>
    );
}


export default Layout(Requests);