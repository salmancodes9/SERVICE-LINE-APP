"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const predefinedResponses: Record<string, string> = {
  "how to add item": "To add an item, click on 'Add Item' in the navigation bar. Fill in the item name, price, and upload an image. Then click 'Add Item' to list it on the marketplace!",
  "how to contact seller": "To contact a seller, find the item you're interested in on the marketplace and click the 'Contact Seller' button on the item card. This will allow you to reach out to the seller directly.",
  "is this app free": "Yes! CampusCart is completely free for all students. You can browse, buy, and sell items without any charges or hidden fees.",
  "what is campuscart": "CampusCart is a student marketplace where juniors can buy used academic items like books, drafters, lab equipment, and notes from seniors at affordable prices.",
  "how to search items": "Use the search bar at the top of the marketplace page to search for items by name. You can also use category filters to narrow down your search.",
  "how to delete item": "Currently, items can be managed from your Profile page. Navigate to Profile to see your listed items and manage them.",
  "help": "I can help you with:\n• How to add an item\n• How to contact a seller\n• Is this app free?\n• What is CampusCart?\n• How to search items\n\nJust ask me anything!",
  "hello": "Hello! Welcome to CampusCart support. How can I help you today?",
  "hi": "Hi there! I'm here to help you with CampusCart. What would you like to know?",
}

function findResponse(input: string): string {
  const lowerInput = input.toLowerCase().trim()
  
  for (const [key, response] of Object.entries(predefinedResponses)) {
    if (lowerInput.includes(key) || key.includes(lowerInput)) {
      return response
    }
  }
  
  return "I'm not sure about that. Try asking:\n• How to add item?\n• How to contact seller?\n• Is this app free?\n\nOr type 'help' for more options!"
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi! I'm your CampusCart assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        text: findResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 sm:w-[400px]">
          <CardHeader className="flex-shrink-0 border-b border-border bg-primary px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base text-primary-foreground">CampusCart Support</CardTitle>
                <p className="text-xs text-primary-foreground/80">Always here to help</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${
                    message.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      message.sender === "user"
                        ? "bg-primary"
                        : "bg-secondary"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-secondary-foreground" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm">{message.text}</p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                    <Bot className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-secondary px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 border-t border-border p-4">
              <div className="flex items-center gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Try: &quot;How to add item?&quot; or &quot;help&quot;
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
