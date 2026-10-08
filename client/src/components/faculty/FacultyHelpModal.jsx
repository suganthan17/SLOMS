import { useEffect, useRef, useState } from "react";
import { X, HelpCircle, ShieldCheck } from "lucide-react";

const helpTopics = [
  {
    id: 1,
    question: "How can I view pending leave requests?",
    answer:
      "Open the Leave Requests page from the sidebar. You can view all pending leave applications submitted by students from your department.",
  },
  {
    id: 2,
    question: "How do I approve a leave request?",
    answer:
      "Open a pending leave request and review the student's details and leave information. If everything is correct, select Approve to approve the request.",
  },
  {
    id: 3,
    question: "How do I reject a leave request?",
    answer:
      "Open the pending leave request, review the details, and select Reject. You can provide a reason for the rejection when required.",
  },
  {
    id: 4,
    question: "Where can I view leave history?",
    answer:
      "Open Leave History from the sidebar. You can view previously processed leave requests and their current status.",
  },
  {
    id: 5,
    question: "How can I view student details?",
    answer:
      "Open the Students page from the sidebar. You can view the student information available to your faculty account.",
  },
  {
    id: 6,
    question: "Why can't I approve a leave request?",
    answer:
      "Only pending requests from students belonging to your department can be approved. If the request is no longer pending or belongs to another department, it cannot be approved.",
  },
  {
    id: 7,
    question: "How can I check my assigned students?",
    answer:
      "Open the Students page to view the students assigned to you and their available academic details.",
  },
  {
    id: 8,
    question: "How can I update my profile?",
    answer:
      "Click your profile section in the top-right corner of the navbar to open your profile and view your account information.",
  },
];

function FacultyHelpModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [availableTopics, setAvailableTopics] = useState(helpTopics);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const replyTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: "welcome",
          type: "admin",
          text: "Hello! I'm the SLOMS Administrator. How can I help you?",
        },
      ]);

      setAvailableTopics(helpTopics);
      setIsTyping(false);
    }

    return () => {
      if (replyTimerRef.current) {
        clearTimeout(replyTimerRef.current);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleQuestion = (topic) => {
    if (isTyping) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `student-${topic.id}`,
        type: "student",
        text: topic.question,
      },
    ]);

    setAvailableTopics((prev) => prev.filter((item) => item.id !== topic.id));

    setIsTyping(true);

    replyTimerRef.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `admin-${topic.id}`,
          type: "admin",
          text: topic.answer,
        },
      ]);

      setIsTyping(false);
    }, 1200);
  };

  const handleClose = () => {
    if (replyTimerRef.current) {
      clearTimeout(replyTimerRef.current);
    }

    setIsTyping(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <div className="flex h-[650px] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-gray-50 shadow-xl">
        <div className="flex items-center justify-between bg-[#003459] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#007EA7]">
              <ShieldCheck size={20} className="text-white" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Admin Support</p>

              <p className="text-xs text-gray-300">SLOMS Administrator</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "student" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] ${
                    message.type === "student" ? "items-end" : "items-start"
                  }`}
                >
                  <p
                    className={`mb-1 text-[11px] font-medium text-gray-500 ${
                      message.type === "student" ? "text-right" : "text-left"
                    }`}
                  >
                    {message.type === "student" ? "You" : "Admin"}
                  </p>

                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.type === "student"
                        ? "rounded-br-md bg-[#007EA7] text-white"
                        : "rounded-bl-md border border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div>
                  <p className="mb-1 text-left text-[11px] font-medium text-gray-500">
                    Admin
                  </p>

                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {availableTopics.length > 0 && (
          <div className="border-t border-gray-200 bg-white px-4 py-4">
            <div className="mb-2 flex items-center gap-2">
              <HelpCircle size={15} className="text-[#007EA7]" />

              <p className="text-xs font-semibold text-gray-600">
                Choose a question
              </p>
            </div>

            <div className="max-h-32 space-y-2 overflow-y-auto">
              {availableTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleQuestion(topic)}
                  disabled={isTyping}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-xs text-gray-600 transition hover:border-[#007EA7] hover:bg-blue-50 hover:text-[#007EA7] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {topic.question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FacultyHelpModal;
