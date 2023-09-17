import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import io from 'socket.io-client';
import AuthService from "../../utils/auth";
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_CHAT_MESSAGE } from '../../utils/mutations';
import { GET_PREV_CHAT_MESSAGES } from '../../utils/queries';
import { useGlobalContext } from "../../utils/globalContext";
import './Chat.css';
const socket = io.connect('http://localhost:3002');

export default function Chat() {
    if (AuthService.loggedIn()) {   
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const companyId = localStorage.getItem("company_id");
    const [createChatMessage] = useMutation(CREATE_CHAT_MESSAGE);
    const { setHasUnreadMessages } = useGlobalContext();
    const chatContainerRef = useRef(null);

    const { loading, data, refetch } = useQuery(GET_PREV_CHAT_MESSAGES, {
        variables: { companyId },
    });
        
    console.log('chat messages query data', data)

    useEffect(() => {
        if (data) {
            setMessages(data.getChatMessages);
            scrollToBottom();
        }
    }
    , [data]);

    
    useEffect(() => {
        if (AuthService.loggedIn()) {
          const profile = AuthService.getProfile();
          //console.log(profile)
          const firstName = profile.data.firstName;
          const lastName = profile.data.lastName;
            setUserName(`${firstName} ${lastName}`);
            setUserId(profile.data._id);
        }
    }, []);

    // console.log(userName)
    // console.log(userId)

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };
    
    const sendMessage = async () => {
        socket.emit('send_message', { companyId, text: message, sender: userId })

        try {
            const { data } = await createChatMessage({
                variables: {
                    companyId,
                    text: message,
                    sender: userId,
                    name: userName,
                },
            });
            if (data.createChatMessage) {
                console.log("Chat message created successfully:", data.createChatMessage);
                refetch();
            }
        } catch (error) {
            console.error("Error creating chat message:", error);
        }

        setMessage("");
        scrollToBottom();
    };

    const addMessage = (messageData) => {
        setMessages((prevMessages) => [...prevMessages, messageData]);
        scrollToBottom();
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            addMessage(data);
            refetch();
            if (window.location.pathname !== "/chat") {
                setHasUnreadMessages(true);
            }
        });
    }, [socket]);

    useLayoutEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className='messagecontainer'>
            <h1>Group Chat</h1>
        <div className="message-list" ref={chatContainerRef}>
            {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === userId ? 'sent' : 'received'}`}>
                <div className="message-content">
                    <strong className="message-sender">{msg.name}</strong>
                    <p className="message-text">{msg.text}</p>
                </div>
            </div>
        ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder='Type a message...'
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            className="message-input"
          />
          <button onClick={sendMessage} className="send-button">Send</button>
        </div>
    </div>
        );
    } else {
        return (
            <h1> Please log in to view this page. </h1>
        )
    }
};