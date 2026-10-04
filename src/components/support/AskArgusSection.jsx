import React, { useState, useRef, useEffect } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { SUGGESTED_CHAT_PROMPTS, generateMockAssistantResponse } from '../../mock/supportData';
import {
  Sparkles,
  Send,
  RotateCcw,
  User,
  Bot,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  Clock
} from 'lucide-react';

export default function AskArgusSection({
  onStartComplaintWithContext
}) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I am the **ARGUS Demonstration Support Assistant**.\n\nI can explain standard customer policies, check common fulfillment timelines, or help identify whether your issue requires an autonomous multi-agent dispute investigation.\n\nHow can I help you today?`,
      timestamp: 'Just now',
      canInvestigate: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend = null) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMessageId = `user-${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        sender: 'user',
        text,
        timestamp: nowTime
      }
    ]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing delay (600ms)
    setTimeout(() => {
      const response = generateMockAssistantResponse(text);
      const assistantMessageId = `assistant-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          sender: 'assistant',
          text: response.text,
          category: response.category,
          canInvestigate: response.canInvestigate,
          suggestedAction: response.suggestedAction,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userQuery: text
        }
      ]);
      setIsTyping(false);
    }, 650);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetConversation = () => {
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `Hello! I am the **ARGUS Demonstration Support Assistant**.\n\nI can explain standard customer policies, check common fulfillment timelines, or help identify whether your issue requires an autonomous multi-agent dispute investigation.\n\nHow can I help you today?`,
        timestamp: 'Just now',
        canInvestigate: false
      }
    ]);
    setInputValue('');
    setIsTyping(false);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
      {/* Top Controls Header */}
      <Card variant="default" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(6, 182, 212, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)'
                }}
              >
                <Sparkles size={16} />
              </div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Ask ARGUS — Customer Support Assistant
              </h2>
              <Badge variant="cyan" size="sm">
                Demonstration AI
              </Badge>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Simulated guidance based on verified platform SLA policies. Real databases and payment rails are not queried.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetConversation}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Start new conversation"
          >
            <RotateCcw size={12} />
            <span>New Chat</span>
          </button>
        </div>
      </Card>

      {/* Suggested Inquiries Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-faint)', whiteSpace: 'nowrap', fontWeight: 600 }}>
          Suggested:
        </span>
        {SUGGESTED_CHAT_PROMPTS.map((prompt) => (
          <button
            key={prompt.id}
            type="button"
            onClick={() => handleSendMessage(prompt.text)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-full)',
              padding: '5px 12px',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
            }}
          >
            <span>{prompt.title}</span>
          </button>
        ))}
      </div>

      {/* Main Conversation Stream Window */}
      <Card
        variant="default"
        style={{
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '520px',
          overflow: 'hidden'
        }}
      >
        {/* Messages Stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                {!isUser && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(6, 182, 212, 0.15)',
                      border: '1px solid var(--glass-border-cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)',
                      flexShrink: 0
                    }}
                  >
                    <Bot size={16} />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: isUser ? '75%' : '82%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  {/* Bubble */}
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      background: isUser ? 'var(--bg-elevated)' : 'var(--bg-tertiary)',
                      border: isUser ? '1px solid var(--glass-border-light)' : '1px solid var(--glass-border)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {msg.text.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} style={{ margin: pIdx > 0 ? '10px 0 0 0' : 0 }}>
                          {paragraph.split('**').map((chunk, cIdx) => (
                            cIdx % 2 === 1 ? (
                              <strong key={cIdx} style={{ color: 'var(--accent-cyan)' }}>
                                {chunk}
                              </strong>
                            ) : chunk
                          ))}
                        </p>
                      ))}
                    </div>

                    {/* Investigation Bridge Action Card */}
                    {msg.canInvestigate && (
                      <div
                        style={{
                          marginTop: '12px',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--glass-border-cyan)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '10px'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                            AUTONOMOUS INVESTIGATION RECOMMENDED
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            Category: {msg.category}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onStartComplaintWithContext && onStartComplaintWithContext({
                              category: msg.category,
                              description: msg.userQuery
                            });
                          }}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '11px', padding: '4px 10px', height: '28px' }}
                        >
                          <FileText size={12} />
                          <span>{msg.suggestedAction || 'File Formal Complaint'}</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '4px', padding: '0 4px' }}>
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      flexShrink: 0
                    }}
                  >
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid var(--glass-border-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                  flexShrink: 0
                }}
              >
                <Bot size={16} />
              </div>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '16px 16px 16px 2px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span className="pulse-indicator-dot" />
                <span>ARGUS Assistant is analyzing policy guidelines...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Composer Bar */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--glass-border)',
            background: 'var(--bg-surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question or describe an issue (e.g. 'My order was charged twice')..."
              className="input-field"
              style={{
                flex: 1,
                height: '42px',
                fontSize: '13px',
                borderRadius: 'var(--radius-md)'
              }}
              disabled={isTyping}
            />

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="btn btn-primary"
              style={{
                height: '42px',
                padding: '0 18px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Send</span>
              <Send size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-faint)' }}>
            <span>Press Enter to send • Shift+Enter for newline</span>
            <span>Simulated Customer Support Mode</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
