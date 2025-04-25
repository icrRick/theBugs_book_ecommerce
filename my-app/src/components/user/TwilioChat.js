"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Client as ConversationsClient } from "@twilio/conversations"

const TwilioChat = ({ shop, user, isOpen, onClose, onMinimize }) => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [conversation, setConversation] = useState(null)
    const [twilioClient, setTwilioClient] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [unreadCount, setUnreadCount] = useState(0)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [attachments, setAttachments] = useState([])
    const fileInputRef = useRef(null)
    const messagesEndRef = useRef(null)
    const typingTimeoutRef = useRef(null)
    const chatContainerRef = useRef(null)

    // Giả lập token từ backend
    const getToken = useCallback(async () => {
        try {
            // Trong thực tế, bạn sẽ gọi API để lấy token từ backend
            // Backend sẽ tạo token sử dụng Twilio SDK với identity là user.id
            // Ví dụ: const response = await fetch('/api/twilio/token', { method: 'POST', body: JSON.stringify({ userId: user.id }) })

            // Giả lập response từ server
            await new Promise((resolve) => setTimeout(resolve, 800))
            return {
                token: "FAKE_TWILIO_TOKEN_FOR_DEMO_PURPOSES",
                identity: user?.id || "guest-user",
            }
        } catch (err) {
            console.error("Error getting token:", err)
            setError("Không thể kết nối đến dịch vụ chat. Vui lòng thử lại sau.")
            return null
        }
    }, [user])

    // Khởi tạo Twilio client
    useEffect(() => {
        if (!isOpen || twilioClient) return

        const initTwilioClient = async () => {
            setIsLoading(true)
            try {
                const tokenData = await getToken()
                if (!tokenData) return

                const client = new ConversationsClient(tokenData.token)

                client.on("connectionStateChanged", (state) => {
                    if (state === "connected") {
                        console.log("Connected to Twilio Conversations")
                    } else if (state === "disconnected") {
                        console.log("Disconnected from Twilio Conversations")
                    }
                })

                client.on("conversationAdded", (conv) => {
                    if (conv.uniqueName === `shop_${shop.id}_user_${user.id}`) {
                        setupConversation(conv)
                    }
                })

                await client.initialize()
                setTwilioClient(client)

                // Tìm hoặc tạo cuộc trò chuyện
                await findOrCreateConversation(client)
            } catch (err) {
                console.error("Error initializing Twilio client:", err)
                setError("Không thể khởi tạo kết nối chat. Vui lòng thử lại sau.")
            } finally {
                setIsLoading(false)
            }
        }

        initTwilioClient()

        return () => {
            if (twilioClient) {
                twilioClient.shutdown()
            }
        }
    }, [isOpen, shop, user, getToken, twilioClient])

    // Tìm hoặc tạo cuộc trò chuyện
    const findOrCreateConversation = async (client) => {
        try {
            const conversationUniqueName = `shop_${shop.id}_user_${user.id}`

            // Tìm cuộc trò chuyện hiện có
            try {
                const conv = await client.getConversationByUniqueName(conversationUniqueName)
                setupConversation(conv)
            } catch (err) {
                // Nếu không tìm thấy, tạo mới
                console.log("Creating new conversation")
                const newConv = await client.createConversation({
                    uniqueName: conversationUniqueName,
                    friendlyName: `Chat with ${shop.name}`,
                })

                // Thêm người dùng và shop vào cuộc trò chuyện
                // Trong thực tế, bạn sẽ thêm shop thông qua webhook hoặc function ở backend
                await newConv.join()

                // Giả lập thêm shop vào cuộc trò chuyện (trong thực tế sẽ được xử lý ở backend)
                // await newConv.add(`shop_${shop.id}`)

                setupConversation(newConv)
            }
        } catch (err) {
            console.error("Error finding or creating conversation:", err)
            setError("Không thể tạo cuộc trò chuyện. Vui lòng thử lại sau.")
        }
    }

    // Thiết lập cuộc trò chuyện và lắng nghe tin nhắn mới
    const setupConversation = (conv) => {
        setConversation(conv)

        // Lấy tin nhắn cũ
        conv.getMessages().then((messagePaginator) => {
            const messageItems = messagePaginator.items || []
            setMessages(
                messageItems.map((item) => ({
                    id: item.sid,
                    sender: item.author === user.id ? "user" : "shop",
                    text: item.body,
                    media: item.attachedMedia?.length > 0 ? item.attachedMedia.map((media) => media.url) : [],
                    time: new Date(item.dateCreated),
                })),
            )
        })

        // Lắng nghe tin nhắn mới
        conv.on("messageAdded", (message) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: message.sid,
                    sender: message.author === user.id ? "user" : "shop",
                    text: message.body,
                    media: message.attachedMedia?.length > 0 ? message.attachedMedia.map((media) => media.url) : [],
                    time: new Date(message.dateCreated),
                },
            ])

            // Tăng số tin nhắn chưa đọc nếu người dùng không mở chat
            if (!isOpen && message.author !== user.id) {
                setUnreadCount((prev) => prev + 1)
            }
        })

        // Lắng nghe sự kiện typing
        conv.on("typingStarted", (participant) => {
            if (participant !== user.id) {
                setIsTyping(true)
            }
        })

        conv.on("typingEnded", (participant) => {
            if (participant !== user.id) {
                setIsTyping(false)
            }
        })

        // Đánh dấu tất cả tin nhắn là đã đọc khi mở chat
        if (isOpen) {
            conv.setAllMessagesRead().then(() => {
                setUnreadCount(0)
            })
        }
    }

    // Cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Đánh dấu đã đọc khi mở chat
    useEffect(() => {
        if (isOpen && conversation) {
            conversation.setAllMessagesRead().then(() => {
                setUnreadCount(0)
            })
        }
    }, [isOpen, conversation])

    // Xử lý gửi tin nhắn
    const handleSendMessage = async () => {
        if ((!newMessage.trim() && attachments.length === 0) || !conversation) return

        try {
            // Gửi tin nhắn văn bản
            if (newMessage.trim()) {
                await conversation.sendMessage(newMessage.trim())
            }

            // Gửi tin nhắn có đính kèm
            if (attachments.length > 0) {
                for (const file of attachments) {
                    const formData = new FormData()
                    formData.append("media", file)

                    // Trong thực tế, bạn sẽ gửi file lên Twilio Media API
                    // const response = await fetch('/api/twilio/upload-media', { method: 'POST', body: formData })
                    // const mediaUrl = await response.json()

                    // Giả lập gửi media
                    await conversation.sendMessage({
                        contentType: file.type,
                        media: URL.createObjectURL(file),
                        filename: file.name,
                        body: "Đã gửi một tệp đính kèm",
                    })
                }
            }

            setNewMessage("")
            setAttachments([])
            setShowEmojiPicker(false)
        } catch (err) {
            console.error("Error sending message:", err)
            alert("Không thể gửi tin nhắn. Vui lòng thử lại.")
        }
    }

    // Xử lý khi nhấn Enter để gửi tin nhắn
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    // Gửi trạng thái đang nhập
    const handleTyping = () => {
        if (!conversation) return

        conversation.typing()

        // Dừng trạng thái đang nhập sau 5 giây
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            conversation.typing()
        }, 5000)
    }

    // Xử lý chọn file
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 0) {
            setAttachments((prev) => [...prev, ...files])
        }
    }

    // Xóa file đã chọn
    const removeAttachment = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index))
    }

    // Định dạng thời gian
    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // Thêm emoji vào tin nhắn
    const addEmoji = (emoji) => {
        setNewMessage((prev) => prev + emoji)
    }

    if (!isOpen) return null

    return (
        <div
            ref={chatContainerRef}
            className="fixed bottom-0 right-4 z-50 flex flex-col bg-white rounded-t-xl shadow-xl w-full max-w-sm overflow-hidden transition-all duration-300 ease-in-out"
            style={{
                height: "500px",
                maxHeight: "80vh",
                transform: "translateY(0)",
                boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
            }}
        >
            {/* Header */}
            <div className="bg-indigo-600 text-white p-3 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="relative">
                        <img
                            src={shop.logo || "/placeholder.svg"}
                            alt={shop.name}
                            className="w-8 h-8 rounded-full object-cover border-2 border-white mr-2"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></span>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm">{shop.name}</h3>
                        <div className="flex items-center text-xs text-indigo-100">
                            <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                            Trực tuyến
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={onMinimize}
                        className="text-white hover:text-indigo-200 transition-colors mr-2"
                        aria-label="Thu nhỏ"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button onClick={onClose} className="text-white hover:text-indigo-200 transition-colors" aria-label="Đóng">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <p className="mt-3 text-sm text-gray-600">Đang kết nối...</p>
                    </div>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center p-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <h3 className="text-base font-medium text-gray-900 mb-1">Không thể kết nối</h3>
                        <p className="text-sm text-gray-600 mb-3">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            )}

            {/* Messages */}
            {!isLoading && !error && (
                <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7 text-indigo-600"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-base font-medium text-gray-900 mb-1">Bắt đầu cuộc trò chuyện</h3>
                            <p className="text-sm text-gray-600">Hãy gửi tin nhắn để bắt đầu trò chuyện với {shop.name}</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    {message.sender === "shop" && (
                                        <img
                                            src={shop.logo || "/placeholder.svg"}
                                            alt={shop.name}
                                            className="h-7 w-7 rounded-full mr-1.5 self-end"
                                        />
                                    )}
                                    <div
                                        className={`max-w-[80%] rounded-lg p-2.5 ${message.sender === "user"
                                                ? "bg-indigo-600 text-white rounded-tr-none"
                                                : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                                            }`}
                                    >
                                        {message.media && message.media.length > 0 && (
                                            <div className="mb-1.5 space-y-1.5">
                                                {message.media.map((url, index) => {
                                                    const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i)
                                                    return isImage ? (
                                                        <img
                                                            key={index}
                                                            src={url || "/placeholder.svg"}
                                                            alt="Attached media"
                                                            className="max-w-full rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                                                            onClick={() => window.open(url, "_blank")}
                                                        />
                                                    ) : (
                                                        <div key={index} className="flex items-center p-1.5 bg-gray-100 rounded-md">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 text-gray-500 mr-1.5"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            <a
                                                                href={url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-indigo-600 text-xs hover:underline"
                                                            >
                                                                {url.split("/").pop()}
                                                            </a>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                        {message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
                                        <p
                                            className={`text-xs mt-1 text-right ${message.sender === "user" ? "text-indigo-100" : "text-gray-500"
                                                }`}
                                        >
                                            {formatTime(message.time)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <img
                                        src={shop.logo || "/placeholder.svg"}
                                        alt={shop.name}
                                        className="h-7 w-7 rounded-full mr-1.5 self-end"
                                    />
                                    <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-tl-none max-w-[80%] p-2.5">
                                        <div className="flex space-x-1">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div
                                                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "0.2s" }}
                                            ></div>
                                            <div
                                                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "0.4s" }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            )}

            {/* Attachments preview */}
            {attachments.length > 0 && (
                <div className="bg-gray-50 border-t border-gray-200 p-2">
                    <div className="flex flex-wrap gap-2">
                        {attachments.map((file, index) => (
                            <div key={index} className="relative group">
                                <div className="w-14 h-14 border border-gray-300 rounded-md overflow-hidden bg-white flex items-center justify-center">
                                    {file.type.startsWith("image/") ? (
                                        <img
                                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                                            alt="Preview"
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-center p-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mx-auto text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                            <span className="text-xs truncate block">{file.name.split(".").pop()}</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeAttachment(index)}
                                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            {!isLoading && !error && (
                <div className="p-2 border-t border-gray-200 bg-white">
                    <div className="flex items-center">
                        <div className="flex space-x-1 mr-1.5">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Đính kèm file"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Chọn emoji"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                        <textarea
                            value={newMessage}
                            onChange={(e) => {
                                setNewMessage(e.target.value)
                                handleTyping()
                            }}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm"
                            rows={1}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() && attachments.length === 0}
                            className={`ml-1.5 p-1.5 rounded-full ${!newMessage.trim() && attachments.length === 0
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                }`}
                            aria-label="Gửi tin nhắn"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>

                    {/* Emoji picker */}
                    {showEmojiPicker && (
                        <div className="mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <div className="grid grid-cols-8 gap-1">
                                {[
                                    "😊",
                                    "😂",
                                    "❤️",
                                    "👍",
                                    "👋",
                                    "🙏",
                                    "🔥",
                                    "⭐",
                                    "😍",
                                    "😎",
                                    "🤔",
                                    "😢",
                                    "😡",
                                    "🎉",
                                    "👏",
                                    "🌟",
                                    "💯",
                                    "💪",
                                    "🤝",
                                    "👀",
                                    "💬",
                                    "📸",
                                    "🛒",
                                    "🎁",
                                ].map((emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={() => addEmoji(emoji)}
                                        className="w-7 h-7 text-lg hover:bg-gray-100 rounded flex items-center justify-center"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="text-xs text-gray-500 mt-1 text-center">Nhấn Enter để gửi, Shift + Enter để xuống dòng</div>
                </div>
            )}
        </div>
    )
}

export default TwilioChat
