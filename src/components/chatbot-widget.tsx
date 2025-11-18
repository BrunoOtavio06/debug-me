import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Card } from './ui/card';
import { Send, X, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { sendMessage, ChatMessage } from '../services/chatbot';
import { UserProgress } from '../App';
import { Profile } from '../services/career-data';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

interface ChatbotWidgetProps {
  userProgress: UserProgress;
  selectedCareerProfile?: Profile | null;
}

export function ChatbotWidget({ userProgress, selectedCareerProfile }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm BuggyChat, your AI tutor. I can help you with programming questions, career paths, upskilling, job interviews, and automation risk analysis. What would you like to learn today?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<React.ElementRef<typeof ScrollAreaPrimitive.Root>>(null);
  const viewportRef = useRef<HTMLElement | null>(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (!isOpen) return;

    // Don't auto-scroll if user is manually scrolling
    if (isUserScrollingRef.current) return;

    // Function to find and cache the viewport element
    const getViewport = (): HTMLElement | null => {
      if (viewportRef.current) {
        return viewportRef.current;
      }
      
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
        if (viewport) {
          viewportRef.current = viewport;
          return viewport;
        }
      }
      return null;
    };

    // Scroll to bottom function
    const scrollToBottom = () => {
      // Check again if user started scrolling during the delay
      if (isUserScrollingRef.current) return;

      const viewport = getViewport();
      if (viewport) {
        // Use scrollTo for better browser compatibility
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'smooth'
        });
      } else if (messagesEndRef.current) {
        // Fallback: use scrollIntoView on messagesEndRef
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    };

    // Use multiple attempts to ensure scrolling works after DOM updates
    const attemptScroll = () => {
      // Check if user is scrolling before attempting
      if (isUserScrollingRef.current) return;

      requestAnimationFrame(() => {
        if (isUserScrollingRef.current) return;
        scrollToBottom();
        // Try again after a short delay to catch any async content rendering
        setTimeout(() => {
          if (!isUserScrollingRef.current) {
            scrollToBottom();
          }
        }, 50);
      });
    };

    // Initial scroll attempt
    attemptScroll();
    
    // Additional attempt after a longer delay for async content
    const timeoutId = setTimeout(() => {
      if (!isUserScrollingRef.current) {
        attemptScroll();
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [messages, isLoading, isOpen]);

  // Clear viewport ref when chat closes
  useEffect(() => {
    // Clear viewport ref when chat closes to force recalculation
    viewportRef.current = null;
  }, [isOpen]);

  // Detect user manual scrolling
  useEffect(() => {
    if (!isOpen) return;

    const getViewport = (): HTMLElement | null => {
      if (viewportRef.current) {
        return viewportRef.current;
      }
      
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
        if (viewport) {
          viewportRef.current = viewport;
          return viewport;
        }
      }
      return null;
    };

    const viewport = getViewport();
    if (!viewport) return;

    const handleScroll = () => {
      // Check if user scrolled away from bottom (within 50px threshold)
      const isNearBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 50;
      
      // Only mark as user scrolling if they're not at/near the bottom
      // This prevents blocking auto-scroll when programmatic scroll reaches bottom
      if (!isNearBottom) {
        isUserScrollingRef.current = true;

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Reset user scrolling flag after user stops scrolling for 150ms
        scrollTimeoutRef.current = setTimeout(() => {
          isUserScrollingRef.current = false;
        }, 150);
      } else {
        // If user scrolled back to bottom, allow auto-scroll again
        isUserScrollingRef.current = false;
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      }
    };

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    viewport.addEventListener('wheel', handleScroll, { passive: true });

    return () => {
      viewport.removeEventListener('scroll', handleScroll);
      viewport.removeEventListener('wheel', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle click outside to close chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setError(null);

    // Add user message to chat
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userMessage },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Get AI response
      const response = await sendMessage(
        userMessage,
        messages,
        userProgress.completedLessons,
        selectedCareerProfile || undefined
      );

      // Add AI response to chat
      setMessages([
        ...newMessages,
        { role: 'assistant', content: response },
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Hi! I'm BuggyChat, your AI tutor. I can help you with programming questions, career paths, upskilling, job interviews, and automation risk analysis. What would you like to learn today?",
      },
    ]);
    setError(null);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          aria-label="Open BuggyChat"
        >
          <img
            src="/BuggyChat.png"
            alt="BuggyChat"
            className="w-12 h-12 rounded-full object-cover group-hover:scale-105 transition-transform"
          />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          className="fixed z-50 flex flex-col bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 bottom-6 right-6 w-[600px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)]"
          style={{ backgroundColor: 'white' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/BuggyChat.png"
                alt="BuggyChat"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">BuggyChat</h3>
                <p className="text-xs text-indigo-100">Your AI Tutor & Career Advisor</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearChat();
                }}
                className="text-white hover:bg-white/20 h-8 w-8"
                aria-label="Clear chat"
                title="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="text-white hover:bg-white/20 h-8 w-8"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="h-full w-full">
              <div className="p-4 space-y-4 min-w-full">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <Card
                    className={`max-w-[85%] p-3 overflow-visible ${
                      message.role === 'user'
                        ? 'bg-indigo-100 text-black'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-sm prose prose-sm max-w-none dark:prose-invert" style={{ overflowWrap: 'break-word' }}>
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            const language = match ? match[1] : '';
                            return !inline && language ? (
                              <div className="my-2 overflow-x-auto w-full">
                                <SyntaxHighlighter
                                  style={vscDarkPlus as any}
                                  language={language}
                                  PreTag="div"
                                  className="rounded-md !m-0"
                                  customStyle={{
                                    margin: 0,
                                    borderRadius: '0.375rem',
                                    minWidth: '100%',
                                  }}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                {children}
                              </code>
                            );
                          },
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="ml-2">{children}</li>,
                          h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-3 first:mt-0">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 mt-3 first:mt-0">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-base font-semibold mb-2 mt-2 first:mt-0">{children}</h3>,
                          blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">{children}</blockquote>,
                          a: ({ children, href }) => <a href={href} className="text-indigo-600 hover:text-indigo-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </Card>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <Card className="bg-gray-100 p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </Card>
                </div>
              )}

              {error && (
                <div className="flex justify-start">
                  <Card className="bg-red-50 border-red-200 p-3">
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  </Card>
                </div>
              )}

              <div ref={messagesEndRef} />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about programming, career paths, upskilling, job interviews, or automation risk..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

