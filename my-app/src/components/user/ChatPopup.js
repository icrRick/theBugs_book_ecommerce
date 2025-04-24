import { useState, useRef, useEffect } from "react"

const ChatPopup = ({ shop, isOpen, onClose }) => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)

    // Giả lập tin nhắn ban đầu khi mở chat
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: 1,
                    sender: "shop",
                    text: `Xin chào! Tôi là nhân viên tư vấn của ${shop.name}. Tôi có thể giúp gì cho bạn?`,
                    time: new Date(),
                },
            ])
        }
    }, [isOpen, shop, messages.length])

    // Cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Xử lý gửi tin nhắn
    const handleSendMessage = () => {
        if (newMessage.trim() === "") return

        // Thêm tin nhắn của người dùng
        const userMessage = {
            id: messages.length + 1,
            sender: "user",
            text: newMessage,
            time: new Date(),
        }
        setMessages((prev) => [...prev, userMessage])
        setNewMessage("")

        // Giả lập shop đang nhập tin nhắn
        setIsTyping(true)
        setTimeout(() => {
            setIsTyping(false)
            // Giả lập tin nhắn phản hồi từ shop
            const shopResponse = {
                id: messages.length + 2,
                sender: "shop",
                text: getRandomResponse(),
                time: new Date(),
            }
            setMessages((prev) => [...prev, shopResponse])
        }, 1500)
    }

    // Xử lý khi nhấn Enter để gửi tin nhắn
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    // Định dạng thời gian
    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // Tạo các câu trả lời ngẫu nhiên
    const getRandomResponse = () => {
        const responses = [
            "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ kiểm tra thông tin và phản hồi sớm nhất có thể.",
            "Dạ vâng, bạn có thể cho chúng tôi biết thêm chi tiết về sản phẩm bạn đang quan tâm không?",
            "Chúng tôi có thể giúp bạn đặt hàng ngay bây giờ nếu bạn muốn.",
            "Sản phẩm này hiện đang có sẵn và chúng tôi có thể giao hàng trong vòng 1-3 ngày làm việc.",
            "Bạn có thể tham khảo thêm các chương trình khuyến mãi hiện tại trên trang chủ của chúng tôi.",
        ]
        return responses[Math.floor(Math.random() * responses.length)]
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden flex flex-col h-[500px] max-h-[90vh]">
                {/* Header */}
                <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <img
                            src={shop.logo || "/placeholder.svg"}
                            alt={shop.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white mr-3"
                        />
                        <div>
                            <h3 className="font-medium">{shop.name}</h3>
                            <div className="flex items-center text-xs text-indigo-100">
                                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                                Đang hoạt động
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-indigo-200 transition-colors"
                        aria-label="Đóng"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    <div className="space-y-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user"
                                            ? "bg-indigo-600 text-white rounded-tr-none"
                                            : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                                        }`}
                                >
                                    <p className="text-sm">{message.text}</p>
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
                                <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-tl-none max-w-[80%] p-3">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input */}
                <div className="p-3 border-t border-gray-200 bg-white">
                    <div className="flex items-center">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                            rows={1}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={newMessage.trim() === ""}
                            className={`ml-2 p-2 rounded-full ${newMessage.trim() === ""
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                }`}
                            aria-label="Gửi tin nhắn"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-center">
                        Nhấn Enter để gửi, Shift + Enter để xuống dòng
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatPopup
