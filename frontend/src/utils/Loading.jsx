const Loading = () => {
  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black z-50">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-[#6bc83f] rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
