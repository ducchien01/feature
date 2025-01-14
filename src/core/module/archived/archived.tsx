// import Picker, { Emoji, EmojiStyle,Theme,SkinTonePickerLocation, SkinTones } from "emoji-picker-react";
import './archived.css'
import EmojiPicker, { Emoji, EmojiStyle, Theme, SkinTonePickerLocation, SkinTones } from "emoji-picker-react";
import Layout from "../../layout/layout";
import { forwardRef, useRef, useState } from "react";
import { Popup, Winicon, showPopup } from "wini-web-components";

// Custom emoji mapping for text-to-emoji conversion
const emojiMapping = {
    ":)": "😊",
    ":(": "☹️",
    ";)": "😉",
    ":D": "😄",
  };
const Archived = () => {
    const [selectedEmoji, setSelectedEmoji] = useState(null); // Emoji selected from picker
    const [darkMode, setDarkMode] = useState(false); // Dark mode state
    const [messages, setMessages] = useState<any>([]); // List of messages
    const [input, setInput] = useState(""); // Input field value
  
    const ref = useRef<any>()
    const showEmojiPicker = (ev: any) => {
        const _box = ev.target.getBoundingClientRect()
        showPopup({                  
            ref: ref,
            style: { 
                top: `${_box.bottom}px`,
                left: `${_box.right}px`,
                position: "absolute", 
                width: "fit-contents" 
            },
            // style: { left: ev.pageX, top: ev.pageY, borderRadius: '0.4rem' },
            clickOverlayClosePopup:true,
            hideButtonClose:false,
            body: <div className="EmojiPickerReact"> 
                <EmojiPicker
            
            height={"300px"}
            width={"300px"}
            // onEmojiClick={handleEmojiClick} // Custom click handler
            // theme={darkMode ? Theme.DARK : Theme.LIGHT} // Dark mode support
            emojiStyle={EmojiStyle.NATIVE} // Emoji set (Google, Apple, Twitter)
            lazyLoadEmojis={true}
            skinTonesDisabled={false} // Enable skin tone selection
            autoFocusSearch={false}
            onSkinToneChange ={ (e) => console.log("onSkinToneChange",e)}
            reactionsDefaultOpen={true}
            onReactionClick={(e) => console.log("onReactionClick",e)} 
        />
          </div>
        })
    }
    // Handle emoji click
    const handleEmojiClick = (emojiData) => {
      setInput((prev) => prev + emojiData.emoji); // Append emoji to input
      setSelectedEmoji(emojiData.emoji); // Store the selected emoji
    };
  
    // Handle message sending
    const handleSendMessage = () => {
      if (input.trim()) {
        // Convert text to emoji
        const convertedMessage = input.replace(/:\)|:\(|;\)|:D/g, (match) => emojiMapping[match] || match);
        setMessages([...messages, convertedMessage]); // Add message to list
        setInput(""); // Clear input field
      }
    };
  
    return (<div>
        <Popup ref={ref} />
      <div
        style={{
          background: darkMode ? "#333" : "#fff",
          color: darkMode ? "#fff" : "#000",
          padding: "20px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
          
        <h1>Emoji Picker Chat App</h1>
        <p>
            My Favorite emoji is:
            <Emoji unified="1f423" size={50} />
        </p>
        {/* <Picker reactionsDefaultOpen={true} onReactionClick={handleReaction} /> */}
       
        <button onClick={() => setDarkMode(!darkMode)} style={{position:"relative"}}>
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>
  
        {/* Emoji Picker */}
        <div style={{ marginTop: "20px" }}>
          <EmojiPicker
            height={"300px"}
            width={"300px"}
            onEmojiClick={handleEmojiClick} // Custom click handler
            theme={darkMode ? Theme.DARK : Theme.LIGHT} // Dark mode support
            emojiStyle={EmojiStyle.NATIVE} // Emoji set (Google, Apple, Twitter)
            lazyLoadEmojis={true}
            skinTonesDisabled={false} // Enable skin tone selection
            autoFocusSearch={false}
            onSkinToneChange ={ (e) => console.log("onSkinToneChange",e)}
            reactionsDefaultOpen={true}
            onReactionClick={(e) => console.log("onReactionClick",e)} 
          />
           {/* <Picker

                customEmojis={[
                {
                names: ['Alice', 'alice in wonderland'],
                imgUrl:
                    'https://cdn.jsdelivr.net/gh/ealush/emoji-picker-react@custom_emojis_assets/alice.png',
                id: 'alice'
                },
                {
                names: ['Dog'],
                imgUrl:
                    'https://cdn.jsdelivr.net/gh/ealush/emoji-picker-react@custom_emojis_assets/dog.png',
                id: 'dog'
                },
                {
                names: ['Hat'],
                imgUrl:
                    'https://cdn.jsdelivr.net/gh/ealush/emoji-picker-react@custom_emojis_assets/hat.png',
                id: 'hat'
                },
                {
                names: ['Vest'],
                imgUrl:
                    'https://cdn.jsdelivr.net/gh/ealush/emoji-picker-react@custom_emojis_assets/vest.png',
                id: 'vest'
                }
            ]}
        /> */}
        {/* <Picker 
            reactionsDefaultOpen={false} 
            onReactionClick={(e) => console.log(e)} 
            height={"300px"}
            width={"300px"}
            onEmojiClick={handleEmojiClick} // Custom click handler
            theme={darkMode ? Theme.DARK : Theme.LIGHT} // Dark mode support
            emojiStyle={EmojiStyle.NATIVE} // Emoji set (Google, Apple, Twitter)
            lazyLoadEmojis={true}
            skinTonesDisabled={false} // Enable skin tone selection
            autoFocusSearch={false}
            onSkinToneChange ={ (e) => console.log(e)}

        /> */}

        <Winicon src='fill/emoticons/smile' size={'2rem'} onClick={(ev) => showEmojiPicker(ev)}/>
        <button onClick={(ev) => showEmojiPicker(ev)}>Icon</button>
        </div>
         
        {/* Chat Messages */}
        <div
          style={{
            marginTop: "20px",
            width: "100%",
            maxWidth: "600px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            overflowY: "auto",
            maxHeight: "300px",
          }}
        >
          {messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: "10px", fontSize: "1.2rem" }}>
              {msg}
            </div>
          ))}
        </div>
  
        {/* Input and Send Button */}
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            width: "100%",
            maxWidth: "600px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#007bff",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
      </div>
    );
}


const PopupUserActions = forwardRef(function PopupUserActions(data, ref) {
    return <div className='col more-action-popup' style={{ padding: '1.2rem 0', width: '22rem' }}>
       <EmojiPicker
                        height={"300px"}
                        width={"300px"}
                        // onEmojiClick={handleEmojiClick} // Custom click handler
                        // theme={darkMode ? Theme.DARK : Theme.LIGHT} // Dark mode support
                        emojiStyle={EmojiStyle.NATIVE} // Emoji set (Google, Apple, Twitter)
                        lazyLoadEmojis={true}
                        skinTonesDisabled={false} // Enable skin tone selection
                        autoFocusSearch={false}
                        onSkinToneChange ={ (e) => console.log("onSkinToneChange",e)}
                        reactionsDefaultOpen={true}
                        onReactionClick={(e) => console.log("onReactionClick",e)} 
                    />
    </div>
  })
  
  
export default Layout(Archived);