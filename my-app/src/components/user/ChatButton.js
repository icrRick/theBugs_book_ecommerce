"use client"

import { useState, useEffect, useRef } from "react"
import TwilioChat from "./TwilioChat"

const ChatButton = ({ shop }) => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isNewMessage, setIsNewMessage] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const buttonRef = useRef(null)

  // Giả lập người dùng đăng nhập
  const user = {
    id: "user-123",
    name: "Khách hàng",
    avatar: "https://placehold.co/100x100/3498db/ffffff?text=User",
  }

  // Giả lập kiểm tra tin nhắn chưa đọc khi component mount
  useEffect(() => {
    const checkUnreadMessages = async () => {
      // Trong thực tế, bạn sẽ gọi API để lấy số tin nhắn chưa đọc
      // Ví dụ: const response = await fetch('/api/chat/unread-count')

      // Giả lập có tin nhắn chưa đọc
      setTimeout(() => {
        const randomCount = Math.floor(Math.random() * 3)
        setUnreadCount(randomCount)
        if (randomCount > 0) {
          setIsNewMessage(true)
          setLastMessage({
            text: "Xin chào! Tôi có thể giúp gì cho bạn?",
            time: new Date(),
          })
          setTimeout(() => setIsNewMessage(false), 5000)
        }
      }, 3000)
    }

    checkUnreadMessages()

    // Giả lập nhận tin nhắn mới mỗi 30 giây
    const interval = setInterval(() => {
      if (!isChatOpen && !isMinimized && Math.random() > 0.7) {
        const messages = [
          "Bạn có cần hỗ trợ gì không?",
          "Chúng tôi đang có chương trình khuyến mãi mới!",
          "Cảm ơn bạn đã ghé thăm shop của chúng tôi.",
          "Bạn đã xem qua sản phẩm mới của chúng tôi chưa?",
        ]
        const randomMessage = messages[Math.floor(Math.random() * messages.length)]

        setUnreadCount((prev) => prev + 1)
        setIsNewMessage(true)
        setLastMessage({
          text: randomMessage,
          time: new Date(),
        })
        setTimeout(() => setIsNewMessage(false), 5000)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [isChatOpen, isMinimized])

  // Reset unread count khi mở chat
  useEffect(() => {
    if (isChatOpen) {
      setUnreadCount(0)
      setIsMinimized(false)
    }
  }, [isChatOpen])

  // Xử lý thu nhỏ chat
  const handleMinimize = () => {
    setIsMinimized(true)
    setIsChatOpen(false)
  }

  // Định dạng thời gian
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      {/* Nút chat */}
      <div className="relative" ref={buttonRef}>
        <button
          onClick={() => {
            setIsChatOpen(true)
            setIsMinimized(false)
          }}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <i className="bi bi-chat-dots mr-2"></i>
          <span>Chat ngay</span>

          {/* Badge hiển thị số tin nhắn chưa đọc */}
          {unreadCount > 0 && (
            <span
              className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ${isNewMessage ? "animate-pulse" : ""}`}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Chat widget */}
      {isChatOpen && (
        <TwilioChat
          shop={shop}
          user={user}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onMinimize={handleMinimize}
        />
      )}

      {/* Chat minimized */}
      {isMinimized && (
        <div
          className="fixed bottom-4 right-4 z-50 flex items-center bg-white rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200 pr-3 pl-1 py-1"
          onClick={() => {
            setIsChatOpen(true)
            setIsMinimized(false)
          }}
        >
          <div className="relative">
            <img
              src={shop.logo || "/placeholder.svg"}
              alt={shop.name}
              className="w-10 h-10 rounded-full border-2 border-indigo-100"
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          {lastMessage && (
            <div className="ml-2 max-w-[180px]">
              <p className="text-xs text-gray-500">{formatTime(lastMessage.time)}</p>
              <p className="text-sm font-medium text-gray-800 truncate">{lastMessage.text}</p>
            </div>
          )}
        </div>
      )}

      {/* Nút chat cố định ở góc màn hình (hiển thị khi không có nút chat trong trang) */}
      {!buttonRef.current && !isChatOpen && !isMinimized && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => {
              setIsChatOpen(true)
              setIsMinimized(false)
            }}
            className="w-14 h-14 bg-indigo-600 rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors group relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            
            {unreadCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ${isNewMessage ? "animate-pulse" : ""}`}
              >
                {unreadCount}
              </span>
            )}

            <span className="absolute top-0 left-0 w-full h-full rounded-full animate-ping bg-indigo-400 opacity-20 group-hover:opacity-0"></span>
          </button>
        </div>
      )}
    </>
  )
}

export default ChatButton
