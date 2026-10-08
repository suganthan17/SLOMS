import { useEffect, useRef, useState } from "react";
import { HelpCircle, X, ShieldCheck } from "lucide-react";

const helpTopics = [
  {
    id: "apply-leave",
    question: "How do I apply for leave?",
    answer:
      "Go to Apply Leave from the sidebar. Select the leave start and end date and time, enter your reason, and submit the request. Your leave request will then be sent to the faculty for approval.",
  },
  {
    id: "leave-status",
    question: "How can I check my leave status?",
    answer:
      "Go to Leave History from the sidebar. You can see all your leave requests and their current status, including Pending, Approved, or Rejected.",
  },
  {
    id: "outpass",
    question: "Where can I find my outpass?",
    answer:
      "Your outpass becomes available after your leave is approved by the faculty. Open the Outpass section from the sidebar to view your approved outpass and QR code.",
  },
  {
    id: "qr",
    question: "How does QR verification work?",
    answer:
      "Show your approved QR code to the security personnel when leaving the campus. Security will scan your QR code and confirm your exit. When you return, the same QR code is scanned again to confirm your entry.",
  },
  {
    id: "pending",
    question: "Why is my leave still pending?",
    answer:
      "Your leave remains Pending until the faculty reviews your request. Please wait for the faculty to approve or reject it.",
  },
  {
    id: "rejected",
    question: "What happens if my leave is rejected?",
    answer:
      "A rejected leave cannot be used for an outpass. Go to Leave History to check the rejection status and any remarks provided by the faculty.",
  },
  {
    id: "entry-exit",
    question: "What happens during exit and entry?",
    answer:
      "During exit, security scans your approved QR code and confirms your exit. When you return to the campus, security scans the QR code again and confirms your entry. Both times are recorded in the system.",
  },
  {
    id: "profile",
    question: "How can I update my profile?",
    answer:
      "Open your profile from the top-right corner of the navbar to view your account details. If you need to change information that cannot be edited there, please contact the administrator.",
  },
];

function TypingIndicator() {
  return (
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
  );
}

function StudentHelpModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [availableTopics, setAvailableTopics] = useState(helpTopics);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const replyTimerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    setMessages([
      {
        id: "welcome",
        type: "admin",
        text: "Hello! Welcome to SLOMS Support. How can I help you?",
      },
    ]);

    setAvailableTopics(helpTopics);
    setIsTyping(false);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (replyTimerRef.current) {
        clearTimeout(replyTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleTopicClick = (topic) => {
    if (isTyping) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `${topic.id}-question-${Date.now()}`,
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
          id: `${topic.id}-answer-${Date.now()}`,
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

    setMessages([]);
    setAvailableTopics(helpTopics);
    setIsTyping(false);
    onClose();
  };

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
                <div className="max-w-[82%]">
                  <p
                    className={`mb-1 text-[11px] font-medium ${
                      message.type === "student"
                        ? "text-right text-gray-400"
                        : "text-left text-gray-500"
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

            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-gray-200 bg-white px-4 py-4">
          {availableTopics.length > 0 ? (
            <>
              <div className="mb-2 flex items-center gap-2">
                <HelpCircle size={15} className="text-[#007EA7]" />

                <p className="text-xs font-semibold text-gray-600">
                  {isTyping ? "Admin is typing..." : "Choose a question"}
                </p>
              </div>

              <div className="max-h-32 space-y-2 overflow-y-auto">
                {availableTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    disabled={isTyping}
                    onClick={() => handleTopicClick(topic)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-xs text-gray-600 transition hover:border-[#007EA7] hover:bg-blue-50 hover:text-[#007EA7] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {topic.question}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
              <p className="text-xs leading-5 text-gray-500">
                These are the available support topics. For any other issue,
                please contact the SLOMS administrator.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentHelpModal;
