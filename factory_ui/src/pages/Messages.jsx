import React, { useState } from 'react';
import { Search, Send, Paperclip, Smile, MoreVertical, Check, CheckCheck, Clock, User, Phone, Mail, MapPin, Calendar } from 'lucide-react';

function Messages() {
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState('');

  // بيانات المحادثات
  const conversations = [
    {
      id: 1,
      user: {
        name: 'مصنع إعادة التدوير المتقدم',
        avatar: 'https://ui-avatars.com/api/?name=مصنع+إعادة+التدوير&background=10b981&color=fff',
        type: 'مصنع إعادة تدوير',
        online: true
      },
      lastMessage: 'هل يمكنك توفير 5 أطنان إضافية هذا الأسبوع؟',
      timestamp: '10:30 ص',
      unread: 2,
      messages: [
        { id: 1, text: 'مرحباً، أنا مهتم بنفايات البلاستيك الخاصة بكم', sender: 'them', time: 'أمس 2:30 م', read: true },
        { id: 2, text: 'أهلاً، نعم متوفر لدينا 3 أطنان بلاستيك نظيف', sender: 'me', time: 'أمس 3:15 م', read: true },
        { id: 3, text: 'ممتاز! ما هو السعر للطن الواحد؟', sender: 'them', time: 'أمس 4:45 م', read: true },
        { id: 4, text: 'السعر 1500 جنيه للطن، شامل التغليف', sender: 'me', time: 'أمس 5:20 م', read: true },
        { id: 5, text: 'هل يمكنك توفير 5 أطنان إضافية هذا الأسبوع؟', sender: 'them', time: '10:30 ص', read: false },
      ]
    },
    {
      id: 2,
      user: {
        name: 'شركة الأوراق الخضراء',
        avatar: 'https://ui-avatars.com/api/?name=شركة+الأوراق&background=3b82f6&color=fff',
        type: 'شركة إعادة تدوير ورق',
        online: false
      },
      lastMessage: 'شكراً على التعاون المثمر',
      timestamp: 'أمس',
      unread: 0,
      messages: [
        { id: 1, text: 'تم استلام شحنة الورق، شكراً لكم', sender: 'them', time: '2 يوم', read: true },
        { id: 2, text: 'العفو، نرجو التعامل معكم مرة أخرى', sender: 'me', time: 'أمس', read: true },
        { id: 3, text: 'شكراً على التعاون المثمر', sender: 'them', time: 'أمس', read: true },
      ]
    },
    {
      id: 3,
      user: {
        name: 'مصنع المعادن الجديد',
        avatar: 'https://ui-avatars.com/api/?name=مصنع+المعادن&background=64748b&color=fff',
        type: 'مصنع معادن',
        online: true
      },
      lastMessage: 'متى يمكننا استلام الشحنة؟',
      timestamp: '3 أيام',
      unread: 0,
      messages: [
        { id: 1, text: 'نحتاج إلى معادن خردة للتصنيع', sender: 'them', time: '5 يوم', read: true },
        { id: 2, text: 'لدينا 2 طن معادن متوفرة', sender: 'me', time: '4 يوم', read: true },
        { id: 3, text: 'متى يمكننا استلام الشحنة؟', sender: 'them', time: '3 أيام', read: true },
      ]
    },
    {
      id: 4,
      user: {
        name: 'مصنع الزجاج الحديث',
        avatar: 'https://ui-avatars.com/api/?name=مصنع+الزجاج&background=10b981&color=fff',
        type: 'مصنع زجاج',
        online: false
      },
      lastMessage: 'سنتصل بكم الأسبوع القادم',
      timestamp: 'أسبوع',
      unread: 0,
      messages: [
        { id: 1, text: 'هل لديكم زجاج صناعي للبيع؟', sender: 'them', time: '2 أسبوع', read: true },
        { id: 2, text: 'نعم، لدينا 1.2 طن زجاج نظيف', sender: 'me', time: '10 يوم', read: true },
        { id: 3, text: 'سنتصل بكم الأسبوع القادم', sender: 'them', time: 'أسبوع', read: true },
      ]
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // في التطبيق الحقيقي، هنا نرسل الرسالة للخادم
      console.log('إرسال رسالة:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">الرسائل</h1>
          <p className="text-slate-600">تواصل مع الشركاء والعملاء</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex h-[600px]">
            {/* Sidebar - Conversations List */}
            <div className="w-full md:w-1/3 border-l border-slate-200">
              {/* Search */}
              <div className="p-4 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="بحث في الرسائل..."
                    className="w-full pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="overflow-y-auto h-[calc(600px-73px)]">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-all ${
                      selectedChat === conversation.id ? 'bg-emerald-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <img
                          src={conversation.user.avatar}
                          alt={conversation.user.name}
                          className="w-12 h-12 rounded-lg"
                        />
                        {conversation.user.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-slate-900 truncate">
                            {conversation.user.name}
                          </h3>
                          <span className="text-xs text-slate-500 whitespace-nowrap">
                            {conversation.timestamp}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-600 truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 && (
                            <span className="bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">
                            {conversation.user.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="hidden md:flex flex-col flex-1">
              {selectedChat > 0 ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={conversations.find(c => c.id === selectedChat)?.user.avatar}
                        alt="User"
                        className="w-10 h-10 rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {conversations.find(c => c.id === selectedChat)?.user.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500">
                            {conversations.find(c => c.id === selectedChat)?.user.type}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            conversations.find(c => c.id === selectedChat)?.user.online 
                              ? 'bg-emerald-500' 
                              : 'bg-slate-300'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversations
                      .find(c => c.id === selectedChat)
                      ?.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-xl p-3 ${
                              msg.sender === 'me'
                                ? 'bg-emerald-600 text-white rounded-tr-none'
                                : 'bg-slate-100 text-slate-900 rounded-tl-none'
                            }`}
                          >
                            <p className="mb-1">{msg.text}</p>
                            <div className={`flex items-center gap-1 text-xs ${
                              msg.sender === 'me' ? 'text-emerald-100' : 'text-slate-500'
                            }`}>
                              <span>{msg.time}</span>
                              {msg.sender === 'me' && (
                                msg.read ? (
                                  <CheckCheck className="w-3 h-3" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-slate-200">
                    <div className="flex items-end gap-3">
                      <div className="flex-1 bg-slate-100 rounded-xl p-2">
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="اكتب رسالتك هنا..."
                          className="w-full bg-transparent border-none focus:outline-none resize-none max-h-32"
                          rows="2"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-slate-500 hover:text-emerald-600">
                              <Paperclip className="w-5 h-5" />
                            </button>
                            <button className="p-1.5 text-slate-500 hover:text-emerald-600">
                              <Smile className="w-5 h-5" />
                            </button>
                          </div>
                          <button
                            onClick={handleSendMessage}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            إرسال
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Empty State when no chat is selected
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <Send className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    اختر محادثة
                  </h3>
                  <p className="text-slate-600 max-w-md">
                    اختر محادثة من القائمة لبدء التواصل مع الشركاء والعملاء
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Info Card (for mobile/selected chat) */}
        {selectedChat > 0 && (
          <div className="md:hidden mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={conversations.find(c => c.id === selectedChat)?.user.avatar}
                alt="User"
                className="w-16 h-16 rounded-lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {conversations.find(c => c.id === selectedChat)?.user.name}
                </h3>
                <p className="text-slate-600">
                  {conversations.find(c => c.id === selectedChat)?.user.type}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <Mail className="w-5 h-5 text-slate-500" />
                <span>contact@factory.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Phone className="w-5 h-5 text-slate-500" />
                <span>+20 123 456 7890</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <MapPin className="w-5 h-5 text-slate-500" />
                <span>المنطقة الصناعية، القاهرة</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;